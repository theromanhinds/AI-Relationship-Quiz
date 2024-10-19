import { db } from './firebase';  // Ensure you have the correct Firebase config in 'firebase.js'
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

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
      const gameID = generateGameID();  // Generate a unique 4-letter game ID
      const gameRef = doc(collection(db, 'games'), gameID);  // Use the game ID as the document ID
  
      // Create the game document in Firestore with initial player and game data
      await setDoc(gameRef, {
        gameID: gameID,              
        players: ['player1'],
        responses:['', ''],
        voted:[false, false],
        score: [0, 0]
      });
  
      console.log('Game created with ID:', gameID);
      return gameID;  // Return the game ID for the first player to share
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
      const gameRef = doc(db, 'games', gameID);  // Reference the game document using the game ID
      const gameSnap = await getDoc(gameRef);  // Get the document snapshot
  
      if (gameSnap.exists()) {  // Check if the game exists in Firestore
        const gameData = gameSnap.data();
  
        // Check if there are fewer than 2 players in the game
        if (gameData.players.length < 2) {
          await updateDoc(gameRef, {
            players: arrayUnion('player2'),  // Add the second player to the 'players' array
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
    // Reference to the specific game document
    if (!gameID) {
        console.error('Invalid gameID provided.');
        return () => {}; // Return a no-op function for cleanup
    }

    const gameRef = doc(db, 'games', gameID);
    let hasPlayer2Joined = false;

    // Setting up the onSnapshot listener
    const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            const gameData = doc.data();
            const players = gameData.players || []; // Ensure players is defined

            // Check if players[1] has been set for the first time (i.e., when player2 joins)
            if (!hasPlayer2Joined && players[1]) {
              hasPlayer2Joined = true; // Mark that player2 has joined
              handlePlayer2Join(players[1]); // Trigger your callback for when player2 joins

              // Optional: Unsubscribe from further changes after player2 joins
              unsubscribe();
          }
        } else {
            console.log('No such document!');
        }
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
};

  ///////////////////////////////////////////////

  export const submitAnswer = async (gameID, playerID, answer) => {
    try {
      const gameRef = doc(db, 'games', gameID);
      console.log("Fetching game document:", gameRef.path);
      const gameSnap = await getDoc(gameRef);
      
      if (gameSnap.exists()) {
        const gameData = gameSnap.data();
        
        if (playerID === 'player1') {
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
    // Reference to the specific game document
    if (!gameID) {
        console.error('Invalid gameID provided.');
        return () => {}; // Return a no-op function for cleanup
    }

    const gameRef = doc(db, 'games', gameID);

    // Setting up the onSnapshot listener
    const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            const gameData = doc.data();
            const responses = gameData.responses || []; // Ensure responses is defined

            // Check if both responses[0] and responses[1] are filled
            if (responses[0] && responses[1]) {
              if (playerID === 'player1'){
                handlePlayer2Answer(responses[1]);
              } else {
                handlePlayer2Answer(responses[0]);
              }
          }
        } else {
            console.log('No such document!');
        }
    });

  
  // Return the unsubscribe function for cleanup
  return unsubscribe;
};

export const submitVote = async (gameID, playerID, points) => {
  try {
    const gameRef = doc(db, 'games', gameID);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const gameData = gameSnap.data();
      let newScoreArray = [...gameData.score]; // Clone the current score array to avoid mutation

      // Update the correct player's score based on playerID
      if (playerID === 'player1') {
        newScoreArray[1] = newScoreArray[1] + points; // Increment player1's score
        await updateDoc(gameRef, {
          [`voted.${0}`]: true,
          score: newScoreArray // Update the whole score array
        });
      } else if (playerID === 'player2') {
        newScoreArray[0] = newScoreArray[0] + points; // Increment player2's score
        await updateDoc(gameRef, {
          [`voted.${1}`]: true,
          score: newScoreArray // Update the whole score array
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
  // Reference to the specific game document
  if (!gameID) {
      console.error('Invalid gameID provided.');
      return () => {}; // Return a no-op function for cleanup
  }

  const gameRef = doc(db, 'games', gameID);

  // Setting up the onSnapshot listener
  const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
          const gameData = doc.data();
          const voted = gameData.voted || []; // Ensure voted is defined

          // Check if both responses[0] and responses[1] are filled
          if (voted[0] && voted[1]) {
              handlePlayer2Vote(gameData.score);
        }
      } else {
          console.log('No such document!');
      }
  });


// Return the unsubscribe function for cleanup
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

export const listenForScoreChange = (gameID, handleScoreChange) => {
  // Reference to the specific game document
  if (!gameID) {
      console.error('Invalid gameID provided.');
      return () => {}; // Return a no-op function for cleanup
  }

  const gameRef = doc(db, 'games', gameID);
  let hasPlayer2Joined = false;

  // Setting up the onSnapshot listener
  const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
          const gameData = doc.data();
          const players = gameData.players || []; // Ensure players is defined

          if (!hasPlayer2Joined && players[1]) {
            hasPlayer2Joined = true; 
            handleScoreChange(); 

            // Optional: Unsubscribe from further changes after player2 joins
            unsubscribe();
        }
      } else {
          console.log('No such document!');
      }
  });

  
  // Return the unsubscribe function for cleanup
  return unsubscribe;
};

export const updateScore = async (playerID, gameID, points) => {
  try {
    const gameRef = doc(db, 'games', gameID);  // Reference the game document using the game ID
    const gameSnap = await getDoc(gameRef);  // Get the document snapshot

  } catch (error) {
    console.error('Error submitting answer:', error);
    return { success: false, message: 'Error submitting answer.' };
  }
};

export const questionsList = ["What is the other player's name?"];