import './App.css';
import Game from './Game';
import StartComponent from './HomeComponents/StartComponent';
import CreateComponent from './HomeComponents/CreateComponent';
import JoinComponent from './HomeComponents/JoinComponent';

import {createGame, joinGame, listenForPlayer2Join, generateQuestionForGame} from './GameFunctions';

import { useState, useEffect } from 'react';

function App() {

  const [playerID, setPlayerID] = useState('');
  const [gameID, setGameID] = useState('');
  const [currentMenu, setCurrentMenu] = useState("home");
  const [currentQuestion, setCurrentQuestion] = useState('');

  const handleCreateGame = async () => {
    try {
      const newGameID = await createGame();
      setGameID(newGameID);
      setPlayerID(1);
  
      console.log(`Game created!`);
    } catch (error) { console.error(error); } };

  const handleJoinGame = async (gameID) => {
    try {
      const result = await joinGame(gameID);
      
      console.log("Successfully joined Game " + gameID);
      setGameID(gameID);
      setPlayerID(2);
      setCurrentMenu("game");
  
    } catch (error) { console.error(error); } };

  useEffect(() => {
    if (playerID !== 1){
      return;
    }
    const unsubscribe = listenForPlayer2Join(gameID, handlePlayer2Join);
    
    return () => unsubscribe();
  }, [gameID]);

  const handlePlayer2Join = (player2) => {
    console.log(`Player 2 has joined: ${player2}`);
    setCurrentMenu("game");
    generateQuestionForGame(gameID);
};

  const handleXButtonClick = () => {
    setCurrentMenu("start");
  }

  const handleJoinButtonClick = () => {
    setCurrentMenu("join");
  }

  const handleCreateButtonClick = () => {
    handleCreateGame();
    setCurrentMenu("create");
  }

  const menus = {
    create: <CreateComponent gameID={gameID}/>,
    join: <JoinComponent handleJoinGame={handleJoinGame}/>,
    start: <StartComponent handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>,
    game: <Game gameID={gameID} playerID={playerID} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/>
  }

  return (
    <div className="App">
      <div className='WindowContainer'>

        <div className='HeaderContainer'>
          <h1 className='Title'>Relationship Quiz!</h1>
          <button onClick={handleXButtonClick}>X</button>
        </div>

        {menus[currentMenu] || <StartComponent handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>}
        
      </div>
    </div>
  );
}

export default App;
