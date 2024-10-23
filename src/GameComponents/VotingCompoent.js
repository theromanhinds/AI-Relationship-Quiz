import React from 'react'
import Answers from './Answers'

function VotingCompoent({currentQuestion, answer, secondPlayerAnswer, handleVote, voted, questionNumber, score,  playerName, secondPlayerName, playerID}) {
  return (
    <div className='MenuContainerInner'>

      <div className='TextContainer'>
        <p className='SmallText'>{playerID === 1 ? playerName : secondPlayerName}: {score[0]} | Question {questionNumber} | {playerID === 1 ? secondPlayerName : playerName}: {score[1]}</p>
        <h1 className='QuestionText'>{currentQuestion || "Loading..."}</h1>
        <Answers playerName={playerName} secondPlayerName={secondPlayerName} answer={answer} secondPlayerAnswer={secondPlayerAnswer}/>
      
      </div>
        
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