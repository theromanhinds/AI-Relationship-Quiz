import './App.css';
import Home from './Home';
import Game from './Game';
import {createGame, joinGame, listenForPlayer2Join, questionsList} from './GameFunctions';

import { useState, useEffect } from 'react';

function App() {

  const [playerID, setPlayerID] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameID, setGameID] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');

  //WORKING: create game
  const handleCreateGame = async () => {
    try {
      const newGameID = await createGame();
      setGameID(newGameID);
      setPlayerID('player1');
  
      console.log(`Game created!`);
    } catch (error) { console.error(error); } };

  //WORKING: join game
  const handleJoinGame = async (gameID) => {
    try {
      const result = await joinGame(gameID);
      console.log(result.message);
  
      setGameID(gameID);
      setPlayerID('player2');
      setGameStarted(true);
      generateQuestion();
  
    } catch (error) { console.error(error); } };

  //WORKING: Listen for player2 joining room!
  useEffect(() => {
    if (playerID !== 'player1'){
      return;
    }
    const unsubscribe = listenForPlayer2Join(gameID, handlePlayer2Join);

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [gameID]);

  //WORKING: start game when 2nd player joins
  const handlePlayer2Join = (player2) => {
    // Your logic when player2 joins
    console.log(`Player 2 has joined: ${player2}`);
    setGameStarted(true);
    generateQuestion();
};

  //TEMPORARY WORKING: need to move to firebase
  const generateQuestion = () => {
    setCurrentQuestion(questionsList[0]);
  }

  //NOT WORKING: when resetting when either player in waiting area
  const handleEndGame = () => {
    setGameStarted(false);
  }

  return (
    <div className="App">
      <div className='WindowContainer'>

        <div className='HeaderContainer'>
          <h1 className='Title'>Relationship Quiz!</h1>
          <button onClick={handleEndGame}>X</button>
        </div>

        {!gameStarted && <Home gameID={gameID} createGame={handleCreateGame} joinGame={handleJoinGame}/>}
        {gameStarted && <Game gameID={gameID} playerID={playerID} currentQuestion={currentQuestion}/>}
      </div>
    </div>
  );
}

export default App;
