import React from 'react'
import TextBar from './TextBar'

function Name({text, setText, handleNameSubmit}) {

  return (
    <div className='MenuContainerInner'>
        <h1 className='BigText'>Enter your name:</h1>
        <TextBar text={text} setText={setText} handleNameSubmit={handleNameSubmit}/>
    </div>
  )
}

export default Name