import React from 'react'
import TextBar from '../TextBar'

function QuestionComponent({currentQuestion, setAnswer, answer, questionNumber, handleSubmit, score, questionAnswered, playerName, secondPlayerName, playerID}) {
  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <p className='SmallText'>{playerID === 1 ? playerName : secondPlayerName}: {score[0]} | Question {questionNumber} | {playerID === 1 ? secondPlayerName : playerName}: {score[1]}</p>
        <h1 className='QuestionText'>{currentQuestion || "Loading..."}</h1>
      </div>

    <TextBar secondPlayerName={secondPlayerName} questionAnswered={questionAnswered} maxLength={"20"} placeholder={"idek lol"} text={answer} setText={setAnswer} handleNameSubmit={handleSubmit}/>

    </div>
  )
}

export default QuestionComponent