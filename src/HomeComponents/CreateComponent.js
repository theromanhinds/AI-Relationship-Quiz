import React from 'react'

function CreateComponent({gameID}) {
  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <p className='SmallText'>Share this code with P2:</p>
        <h1 className='BigText'>{gameID}</h1>
      </div>
    
    <div className='TextBarContainer'>
        <p className='WaitingText'>Waiting for Player 2!</p>
    </div>
    </div>
  )
}

export default CreateComponent