import React from 'react'

function Answers({answer, secondPlayerAnswer}) {
  return (
    <div>
        <p>You: {answer}</p>
        <p>They said: {secondPlayerAnswer}</p>
    </div>
  )
}

export default Answers