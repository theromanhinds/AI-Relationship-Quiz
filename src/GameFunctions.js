import { db } from './firebase'; 
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot, getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

/**
 * Generate a 4-letter game ID using uppercase letters.
 */
const generateGameID = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let gameID = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      gameID += letters[randomIndex];
    }
    return gameID;
  };

  /**
 * Function to create a new game with a unique 4-letter game ID.
 * Adds the first player to the 'players' array in Firestore.
 * 
 * @returns {Promise<string>} - Returns the generated game ID.
 */
export const createGame = async () => {
    try {
      const gameID = generateGameID();
      const gameRef = doc(collection(db, 'games'), gameID); 
  
      await setDoc(gameRef, {
        gameID: gameID,              
        players: [1],
        responses:['', ''],
        voted:[false, false],
        score: [0, 0],
        questions: [],
      });
  
      console.log('Game created with ID:', gameID);
      return gameID; 
    } catch (error) {
      console.error('Error creating game:', error);
      throw new Error('Could not create the game.');
    }
  };
  
  /**
   * Function to join an existing game.
   * Checks if the game exists and has space for the second player.
   * If successful, adds the second player to the 'players' array in Firestore.
   * 
   * @param {string} gameID - The 4-letter game ID entered by the player.
   * @returns {Promise<Object>} - Returns an object with success status and message.
   */
  export const joinGame = async (gameID) => {
    try {
      const gameRef = doc(db, 'games', gameID);  
      const gameSnap = await getDoc(gameRef); 
  
      if (gameSnap.exists()) {
        const gameData = gameSnap.data();
  
        
        if (gameData.players.length < 2) {
          await updateDoc(gameRef, {
            players: arrayUnion(2),
          });
          console.log('Player joined the game!');
          return { success: true, message: 'Joined the game!' };
        } else {
          return { success: false, message: 'The game is full.' };
        }
      } else {
        return { success: false, message: 'Game not found.' };
      }
    } catch (error) {
      console.error('Error joining game:', error);
      return { success: false, message: 'Error joining the game.' };
    }
  };

  export const listenForPlayer2Join = (gameID, handlePlayer2Join) => {
    if (!gameID) {
        console.error('Invalid gameID provided.');
        return () => {};
    }

    const gameRef = doc(db, 'games', gameID);
    let hasPlayer2Joined = false;

    const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            const gameData = doc.data();
            const players = gameData.players || [];

            if (!hasPlayer2Joined && players[1]) {
              hasPlayer2Joined = true;
              handlePlayer2Join(players[1]); 

              unsubscribe();
          }
        } else {
            console.log('No such document!');
        }
    });

    return unsubscribe;
};

  export const submitAnswer = async (gameID, playerID, answer) => {
    try {
      const gameRef = doc(db, 'games', gameID);
      console.log("Fetching game document:", gameRef.path);
      const gameSnap = await getDoc(gameRef);
      
      if (gameSnap.exists()) {
        const gameData = gameSnap.data();
        
        if (playerID === 1) {
          await updateDoc(gameRef, {
            [`responses.${0}`]: answer
          });
        } else {
          await updateDoc(gameRef, {
            [`responses.${1}`]: answer
          });
        }

        console.log('Submitted answer!');
        return { success: true, message: 'Submitted answer!' };

      } else {
        return { success: false, message: 'Game not found.' };
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      return { success: false, message: 'Error submitting answer.' };
    }
  };

  export const listenForPlayer2Answer = (gameID, playerID, handlePlayer2Answer) => {
    if (!gameID) {
        console.error('Invalid gameID provided.');
        return () => {};
    }

    const gameRef = doc(db, 'games', gameID);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            const gameData = doc.data();
            const responses = gameData.responses || []; 

            if (responses[0] && responses[1]) {
              if (playerID === 1){
                handlePlayer2Answer(responses[1]);
              } else {
                handlePlayer2Answer(responses[0]);
              }
          }
        } else {
            console.log('No such document!');
        }
    });

  
  return unsubscribe;
};

export const submitVote = async (gameID, playerID, points) => {
  try {
    const gameRef = doc(db, 'games', gameID);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      let newScoreArray = [...gameData.score]; 

      if (playerID === 1) {
        newScoreArray[1] = newScoreArray[1] + points;
        await updateDoc(gameRef, {
          [`voted.${0}`]: true,
          score: newScoreArray 
        });
      } else if (playerID === 2) {
        newScoreArray[0] = newScoreArray[0] + points;
        await updateDoc(gameRef, {
          [`voted.${1}`]: true,
          score: newScoreArray 
        });
      }

      console.log('Submitted vote and updated score!');
      return { success: true, message: 'Submitted vote!' };
    } else {
      console.log("Game document does not exist");
      return { success: false, message: 'Game not found.' };
    }

  } catch (error) {
    console.error('Error submitting vote:', error);
    return { success: false, message: 'Error submitting vote.' };
  }
};

export const listenForPlayer2Vote = (gameID, handlePlayer2Vote) => {
  if (!gameID) {
      console.error('Invalid gameID provided.');
      return () => {}; 
  }

  const gameRef = doc(db, 'games', gameID);

  const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
          const gameData = doc.data();
          const voted = gameData.voted || []; 

          if (voted[0] && voted[1]) {
              handlePlayer2Vote(gameData.score);
        }
      } else {
          console.log('No such document!');
      }
  });

return unsubscribe;
};

export const resetRound = async (gameID) => {
  try {
    const gameRef = doc(db, 'games', gameID);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      
      await updateDoc(gameRef, {
        responses: ['', ''],
        voted: [false, false]
      });

      console.log('Round reset!');
      return { success: true, message: 'Round reset' };

    } else {
      return { success: false, message: 'Game not found.' };
    }

  } catch (error) {
    console.error('Error resetting round:', error);
    return { success: false, message: 'Error resetting round.' };
  }
};

export const generateQuestionForGame = async (gameID) => {
  try {
    const generateQuestion = httpsCallable(functions, 'generateQuestion'); 
    const response = await generateQuestion({ gameCode: gameID });

    const question = response.data.question; 

    // const gameDocRef = doc(db, 'games', gameID);
    // const gameDoc = await getDoc(gameDocRef);

    // if (gameDoc.exists()) {
    //   const currentQuestions = gameDoc.data().questions || [];
    //   console.log('Current questions:', currentQuestions);
    // } else {
    //   console.log('No document found for this gameID.');
    // }

    // const newQuestionArray = [...gameDoc.data().questions];
    // newQuestionArray.push(question);

    // // Update the document to include the new question
    // await updateDoc(gameDocRef, { questions: newQuestionArray });
    
    console.log('Question saved:', question);
  } catch (error) {
    console.error("Error generating question:", error);
  }
};

export const listenForQuestion = (gameID, setCurrentQuestion) => {
  const db = getFirestore();
  
  const gameDocRef = doc(db, 'games', gameID);
  
  const unsubscribe = onSnapshot(gameDocRef, (doc) => {
    const data = doc.data();
    if (data && data.questions) {
      setCurrentQuestion(data.questions[data.questions.length - 1]); 
    }
  });

  return unsubscribe;
};