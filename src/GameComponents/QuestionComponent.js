import React from 'react'

function QuestionComponent({currentQuestion, setAnswer, answer, handleSubmit}) {
  return (
    <div>
        <h3>{currentQuestion}</h3>
        <form onSubmit={handleSubmit}>
          <input
          onChange={(e) => setAnswer(e.target.value)}
          type="text"
          placeholder="Enter answer"
          value={answer}
          required
          />
          <button type="submit">SEND</button>
        </form>
    </div>
  )
}

export default QuestionComponent