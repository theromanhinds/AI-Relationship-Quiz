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
  const [secondPlayerName, setSecondPlayerName] = useState('');
  const [playerID, setPlayerID] = useState(0);
  const [gameID, setGameID] = useState('');
  const [text, setText] = useState('');
  const [currentMenu, setCurrentMenu] = useState("name");
  const [showXButton, setShowXButton] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    // Initial setting of the height
    handleResize();

    // Adjust the height when the window is resized (e.g. on mobile scroll)
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateGame = async () => {
    try {
      const newGameID = await createGame(playerName);
      setGameID(newGameID);
      setPlayerID(1);
  
    } catch (error) { console.error(error); } };

  const handleJoinGame = async (gameID) => {
    try {
      const result = await joinGame(gameID, playerName);

      if (result) {
        setSecondPlayerName(result);
        setGameID(gameID);
        setPlayerID(2);
        setCurrentMenu("game");
      }
  
    } catch (error) { console.error(error); } };

  useEffect(() => {
    if (playerID !== 1){
      return;
    }
    const unsubscribe = listenForPlayer2Join(gameID, handlePlayer2Join);
    
    return () => unsubscribe();
  }, [gameID]);

  const handlePlayer2Join = (player2Name) => {
    setSecondPlayerName(player2Name);
    setCurrentMenu("game");
    generateQuestionForGame(gameID);
};

  const handleXButtonClick = () => {
    setPlayerName('');
    setText('');
    setQuestionNumber(1);
    setGameID('');
    setPlayerID(0);
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
    setPlayerName(text);
  }

  const menus = {
    create: <CreateComponent gameID={gameID}/>,
    join: <JoinComponent setText={setText} handleJoinGame={handleJoinGame}/>,
    name: <Name text={text} setText={setText} handleNameSubmit={handleNameSubmit}/>,
    start: <StartComponent playerName={playerName} handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>,
    game: <Game playerName={playerName} secondPlayerName={secondPlayerName} gameID={gameID} playerID={playerID} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} questionNumber={questionNumber} setQuestionNumber={setQuestionNumber}/>
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
