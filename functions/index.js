const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {OpenAI} = require("openai");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateQuestion = functions.https.onCall(async (data, context) => {
  const gameCode = data.data.gameCode;
  if (!gameCode) {
    throw new functions.https.HttpsError("invalid-argument",
        "The game code is required.");
  }

  try {
    const gameRef = db.collection("games").doc(gameCode);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Game not found.");
    }

    const prevQuestions = gameDoc.data().questions || [];
    const contentArray = prevQuestions.map((question) => {
      return {type: "text", text: `Previous Question: ${question}`};
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: contentArray,
        },
        {
          role: "user",
          content: "You are the host of a quiz show testing the knowledge " +
         "of a boyfriend and girlfriend to see how well they know " +
         "each other. Give me one question in 12 words or less " +
         "that the couple should be asked.\n\n" +
         "This question should be specific. This question should not " +
         "use the word 'why' or ask 'why' as a follow-up. This question " +
         "shouldn't be fact checking shared experiences between the couple. " +
         "This question should use 'their' instead of 'your partner'." +
         "This question should not repeat a previous question.",
        },
      ],
      max_tokens: 100,
    });

    const question = response.choices[0].message.content.trim();

    await gameRef.update({
      questions: admin.firestore.FieldValue.arrayUnion(question),
    });

    return {question};
  } catch (error) {
    console.error("Error generating question: ", error);
    throw new functions.https.HttpsError("internal",
        "Failed to generate question.");
  }
});
