import React from 'react'
import { useState } from 'react';
import TextBar from '../TextBar';

function JoinComponent({handleJoinGame}) {

    const [gameID, setGameID] = useState('');

    const handleSubmit = async (e) => {
        const result = await handleJoinGame(gameID); 
    };

  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <h1 className='BigText'>Enter the room code:</h1>
      </div>

      <TextBar maxLength={"4"} placeholder={"ABCD"} text={gameID} setText={setGameID} handleNameSubmit={handleSubmit}/>

    </div>
  )
}

export default JoinComponent