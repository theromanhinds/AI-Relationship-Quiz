function TextBar({text, setText, handleNameSubmit}) {

    const handleTextBarSubmit = (e) => {
        e.preventDefault();
        handleNameSubmit();
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
            maxLength="12"
            required
            />
            <button type='submit' className='TextBarButton'>
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
        </form>
    </div>
  )
}

export default TextBar