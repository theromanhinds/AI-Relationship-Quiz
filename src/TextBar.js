function TextBar({secondPlayerName, maxLength, placeholder, text, setText, handleNameSubmit, toUpperCase, questionAnswered}) {

    const handleTextBarSubmit = (e) => {
        e.preventDefault();
        handleNameSubmit();
    }

    const handleChange = (e) => {
      const text = e.target.value;
      if (toUpperCase) {
        setText(text.toUpperCase());
      }  else {
        setText(text);
      }
    }

  return (
    <div className='TextBarContainer'>
    {questionAnswered && <p className='TextBarHoverText'>Waiting for {secondPlayerName}'s answer!</p>}

        <form className='TextBarForm' onSubmit={handleTextBarSubmit}>
            <input
            className='TextBarInput'
            onChange={handleChange}
            type="text"
            value={text}
            placeholder={placeholder || "Julius"}
            maxLength={maxLength || "12"}
            required
            disabled={questionAnswered}
            />
            <button type='submit' className='TextBarButton'>
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
        </form>
    </div>
  )
}

export default TextBar