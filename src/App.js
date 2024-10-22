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
  const [playerID, setPlayerID] = useState(0);
  const [gameID, setGameID] = useState('ABDC');
  const [text, setText] = useState('');
  const [currentMenu, setCurrentMenu] = useState("name");
  const [showXButton, setShowXButton] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);

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
    setPlayerName('');
    setText('');
    setCurrentMenu("name");
    setShowXButton(false);
  }

  const handleJoinButtonClick = () => {
    setCurrentMenu("join");
    setShowXButton(true);
  }

  const handleCreateButtonClick = () => {
    console.log("handling");
    handleCreateGame();
    setCurrentMenu("create");
    setShowXButton(true);
  }

  const handleNameSubmit = () => {
    setCurrentMenu("start");
    setShowXButton(true);
    setPlayerName(text);
  }

  const menus = {
    create: <CreateComponent gameID={gameID}/>,
    join: <JoinComponent setText={setText} handleJoinGame={handleJoinGame}/>,
    name: <Name text={text} setText={setText} handleNameSubmit={handleNameSubmit}/>,
    start: <StartComponent playerName={playerName} handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>,
    game: <Game gameID={gameID} playerID={playerID} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} questionNumber={questionNumber}/>
  }

  return (
    <div className="App">
      <div className='WindowContainer'>

        <div className='HeaderContainer'>
          <h1 className='Title'>Julius</h1>
          {showXButton && 
          <button className='XButton' onClick={handleXButtonClick}>
              <span className="material-symbols-outlined">close</span>
            </button>}
        </div>
        
        <div className='MenuContainerOuter'>
          {menus[currentMenu] || <Name/>}
        </div>

      </div>
    </div>
  );
}

export default App;
