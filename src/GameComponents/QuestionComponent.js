import React from 'react'
import TextBar from '../TextBar'

function QuestionComponent({currentQuestion, setAnswer, answer, questionNumber, handleSubmit}) {
  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <p className='SmallText'>Question {questionNumber}</p>
        <h1 className='QuestionText'>{currentQuestion || "Loading..."}</h1>
      </div>

    <TextBar maxLength={"20"} placeholder={"idek lol"} text={answer} setText={setAnswer} handleNameSubmit={handleSubmit}/>

    </div>
  )
}

export default QuestionComponent