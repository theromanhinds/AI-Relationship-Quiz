import './App.css';
import Game from './Game';
import Name from './Name';
import StartComponent from './HomeComponents/StartComponent';
import CreateComponent from './HomeComponents/CreateComponent';
import JoinComponent from './HomeComponents/JoinComponent';

import {createGame, joinGame, listenForPlayer2Join, generateQuestionForGame} from './GameFunctions';

import { useState, useEffect } from 'react';

function App() {

  const [playerName, setPlayerName] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [gameID, setGameID] = useState('');
  const [text, setText] = useState('');
  const [currentMenu, setCurrentMenu] = useState("name");
  const [showXButton, setShowXButton] = useState(false);
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
    setCurrentMenu("name");
    setShowXButton(false);
  }

  const handleJoinButtonClick = () => {
    setCurrentMenu("join");
    setShowXButton(true);
  }

  const handleCreateButtonClick = () => {
    handleCreateGame();
    setCurrentMenu("create");
    setShowXButton(true);
  }

  const handleNameSubmit = () => {
    setCurrentMenu("start");
    setShowXButton(true);
  }

  const menus = {
    create: <CreateComponent gameID={gameID}/>,
    join: <JoinComponent handleJoinGame={handleJoinGame}/>,
    name: <Name text={text} setText={setText} handleNameSubmit={handleNameSubmit}/>,
    start: <StartComponent handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>,
    game: <Game gameID={gameID} playerID={playerID} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/>
  }

  return (
    <div className="App">
      <div className='WindowContainer'>

        <div className='HeaderContainer'>
          <h1 className='Title'>Julius AI</h1>
          {showXButton && <button onClick={handleXButtonClick}>X</button>}
        </div>
        
        <div className='MenuContainerOuter'>
          {menus[currentMenu] || <Name/>}
        </div>

      </div>
    </div>
  );
}

export default App;
