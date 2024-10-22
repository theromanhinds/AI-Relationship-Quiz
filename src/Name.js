import React from 'react'
import TextBar from './TextBar'

function Name({text, setText, handleNameSubmit}) {

  return (
    <div className='MenuContainerInner'>
      <div className='TextContainer'>
        <h1 className='BigText'>Enter your name:</h1>
      </div>
        <TextBar toUpperCase={false} text={text} setText={setText} handleNameSubmit={handleNameSubmit}/>
    </div>
  )
}

export default Name