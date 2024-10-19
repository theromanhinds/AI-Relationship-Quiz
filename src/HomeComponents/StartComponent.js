import React from 'react'

function StartComponent({handleCreateButtonClick, handleJoinButtonClick}) {
  return (
    <div>
        <button className='BigButton' onClick={handleCreateButtonClick}>Start</button>
        <button className='BigButton' onClick={handleJoinButtonClick}>Join</button>
    </div>
  )
}

export default StartComponent