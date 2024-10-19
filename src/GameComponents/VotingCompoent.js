import React from 'react'

function VotingCompoent({currentQuestion, answer, secondPlayerAnswer, handleVote, voted}) {
  return (
    <div>
        <p>{currentQuestion}</p>
        <p>You said: {answer}</p>
        <p>They said: {secondPlayerAnswer}</p>
        <p>Is this correct?</p>
        {!voted && <button onClick={() => handleVote(true)}>Yes!</button>}
        {!voted && <button onClick={() => handleVote(false)}>No!</button>}

        {voted && <p>Waiting for other player!</p>}
    </div>
  )
}

export default VotingCompoent