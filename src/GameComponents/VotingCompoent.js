import React from 'react'
import Answers from './Answers'

function VotingCompoent({currentQuestion, answer, secondPlayerAnswer, handleVote, voted, questionNumber}) {
  return (
    <div className='MenuContainerInner'>

      <div className='TextContainer'>
        <p className='SmallText'>Question {questionNumber}</p>
        <h1 className='QuestionText'>{currentQuestion || "Loading..."}</h1>
        <Answers answer={answer} secondPlayerAnswer={secondPlayerAnswer}/>
      
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