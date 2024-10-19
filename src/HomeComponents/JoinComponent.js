import React from 'react'
import { useState } from 'react';

function JoinComponent({joinGame}) {

    const [gameID, setGameID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form from refreshing the page
        const result = await joinGame(gameID);  // Call the joinGame function
    
        //Set a status message based on the result
        // if (result.success) {
        //     console.log("Success!")
        // } else {
        //     console.log("Error!")
        // }
    };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter game code"
          value={gameID}
          onChange={(e) => setGameID(e.target.value.toUpperCase())}  // Uppercase to ensure consistency
          required
          maxLength="4"  // Limit to 4 characters
        />
            <button type="submit">JOIN</button>
        </form>
    </div>
  )
}

export default JoinComponent