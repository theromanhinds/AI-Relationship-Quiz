import React from 'react'
import './App.css';
import StartComponent from './HomeComponents/StartComponent';
import CreateComponent from './HomeComponents/CreateComponent';
import JoinComponent from './HomeComponents/JoinComponent';

import { useState } from 'react';

function Home({gameID, createGame, joinGame}) {

    const [hosting, setHosting] = useState(0);

    const handleCreateButtonClick = () => {
        setHosting(1);
        createGame();
    }

    const handleJoinButtonClick = () => {
        setHosting(2);
    }

    return (
        <div className='HomeContainer'>

            {hosting === 1 ? <CreateComponent gameID={gameID}/> : hosting === 2 ? <JoinComponent joinGame={joinGame}/> : <StartComponent handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>}

        </div>
    )
}

export default Home