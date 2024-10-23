import React from 'react'

function Answers({answer, secondPlayerAnswer, playerName, secondPlayerName}) {
  return (
    <div className='AnswerContainer'>

      <div className='YourAnswer'>
        <p className='PlayerName'>You</p>
        <p className='PlayerAnswer'>{answer}</p>
      </div>

      <div className='TheirAnswer'>
      <p className='PlayerName'>{secondPlayerName}</p>
        <p className='PlayerAnswer'>{secondPlayerAnswer}</p>
      </div>
        
    </div>
  )
}

export default Answers