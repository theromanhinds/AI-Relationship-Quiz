import React from 'react'
import Answers from './Answers'

function VotingCompoent({currentQuestion, answer, secondPlayerAnswer, handleVote, voted, questionNumber, score,  playerName, secondPlayerName}) {
  return (
    <div className='MenuContainerInner'>

      <div className='TextContainer'>
        <p className='SmallText'>P1: {score[0]} | Question {questionNumber} | P2: {score[1]} </p>
        <h1 className='QuestionText'>{currentQuestion || "Loading..."}</h1>
        <Answers playerName={playerName} secondPlayerName={secondPlayerName} answer={answer} secondPlayerAnswer={secondPlayerAnswer}/>
      
      </div>

        {/* {!voted && <button onClick={() => handleVote(true)}>Yes!</button>}
        {!voted && <button onClick={() => handleVote(false)}>No!</button>} */}
        
        {!voted && <div className='TextBarContainer'>
          <p className='TextBarHoverText'>Is this correct?</p>
          <div className='BigButtonContainer'>
            <button className='BigButton' onClick={() => handleVote(true)}>Yes!</button>
            <button className='BigButton' onClick={() => handleVote(false)}>No!</button>
          </div>
        </div>}

        {voted && <p className='WaitingText'>Waiting for other player!</p>}
    </div>
  )
}

export default VotingCompoent