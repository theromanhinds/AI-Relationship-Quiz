import React, { useState } from 'react'

function TextBar({text, setText, handleNameSubmit}) {

    const handleTextBarSubmit = (e) => {
        e.preventDefault();
        handleNameSubmit()
    }

  return (
    <div className='TextBarContainer'>
        <form className='TextBarForm' onSubmit={handleTextBarSubmit}>
            <input
            className='TextBarInput'
            onChange={(e) => setText(e.target.value)}
            type="text"
            value={text}
            placeholder="Julius"
            maxLength="16"
            required
            />
            <button type='submit' className='TextBarButton'>SEND</button>
        </form>
    </div>
  )
}

export default TextBar