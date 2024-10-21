import React from 'react'

function StartComponent({playerName, handleCreateButtonClick, handleJoinButtonClick}) {
  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <p className='SmallText'>Hi, {playerName}</p>
        <h1 className='BigText'>Are you Player  1 or Player 2?</h1>
      </div>

        <div className='TextBarContainer'>
          <div className='BigButtonContainer'>
            <button className='BigButton' onClick={handleCreateButtonClick}>P1</button>
            <button className='BigButton' onClick={handleJoinButtonClick}>P2</button>
          </div>
        </div>
    </div>
  )
}

export default StartComponent