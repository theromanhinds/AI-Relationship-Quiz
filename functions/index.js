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
  console.log(data.data);
  const gameCode = data.data.gameCode;
  console.log("GAME CODE IS " + gameCode);
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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are the host of a quiz show testing the " +
              "knowledge of partners in a dating relationship to see " +
              "how accurately they know each other.",
        },
        {
          role: "user",
          content: "Give me one question in 12 words or less that " +
              "the couple should be asked.",
        },
      ],
      max_tokens: 30,
    });

    const question = response.choices[0].message.content.trim();

    await gameRef.update({question});

    return {question};
  } catch (error) {
    console.error("Error generating question: ", error);
    throw new functions.https.HttpsError("internal",
        "Failed to generate question.");
  }
});
