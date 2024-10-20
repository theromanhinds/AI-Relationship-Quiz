import React from 'react'
import { useState } from 'react';

function JoinComponent({handleJoinGame}) {

    const [gameID, setGameID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await handleJoinGame(gameID); 
    };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter game code"
          value={gameID}
          onChange={(e) => setGameID(e.target.value.toUpperCase())} 
          required
          maxLength="4" 
        />
            <button type="submit">JOIN</button>
        </form>
    </div>
  )
}

export default JoinComponent