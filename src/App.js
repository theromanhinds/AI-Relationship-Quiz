import './App.css';
import Home from './Home';
import Game from './Game';
import {createGame, joinGame, listenForPlayer2Join, generateQuestionForGame} from './GameFunctions';

import { useState, useEffect } from 'react';

function App() {

  const [playerID, setPlayerID] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameID, setGameID] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');

  const handleCreateGame = async () => {
    try {
      const newGameID = await createGame();
      setGameID(newGameID);
      setPlayerID('player1');
  
      console.log(`Game created!`);
    } catch (error) { console.error(error); } };

  const handleJoinGame = async (gameID) => {
    try {
      const result = await joinGame(gameID);
      console.log(result.message);
  
      setGameID(gameID);
      setPlayerID('player2');
      setGameStarted(true);
      generateQuestion(gameID);
  
    } catch (error) { console.error(error); } };

  useEffect(() => {
    if (playerID !== 'player1'){
      return;
    }
    const unsubscribe = listenForPlayer2Join(gameID, handlePlayer2Join);

    return () => unsubscribe();
  }, [gameID]);

  const handlePlayer2Join = (player2) => {
    console.log(`Player 2 has joined: ${player2}`);
    setGameStarted(true);
    generateQuestion(gameID);
};

  const generateQuestion = (gameID) => {
    console.log("GENERATING QUESTION for " + gameID);
    generateQuestionForGame(gameID);
  }

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
        {gameStarted && <Game gameID={gameID} playerID={playerID} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/>}
      </div>
    </div>
  );
}

export default App;
