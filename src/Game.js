import React from 'react'
import { useState, useEffect } from 'react'

import QuestionComponent from './GameComponents/QuestionComponent'
import VotingCompoent from './GameComponents/VotingCompoent';

import { listenForPlayer2Answer, submitAnswer, listenForPlayer2Vote, resetRound, submitVote, listenForQuestion, generateQuestionForGame } from './GameFunctions';

function Game({gameID, playerID, currentQuestion, setCurrentQuestion, questionNumber, setQuestionNumber, playerName, secondPlayerName}) {

  const [score, setScore] = useState([0, 0]);

  const [answer, setAnswer] = useState('');
  const [secondPlayerAnswer, setSecondPlayerAnswer] = useState('');

  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [secondPlayerAnswered, setSecondPlayerAnswered] = useState(false);

  const [voted, setVoted] = useState(false);
  const [secondPlayerVote, setSecondPlayerVoted] = useState(false);
  
  useEffect(() => {
    const unsubscribe = listenForQuestion(gameID, setCurrentQuestion);
    return () => unsubscribe();
  }, [gameID]);

  const handleSubmit = async (e) => {
    const result = await submitAnswer(gameID, playerID, answer);
    setQuestionAnswered(true);
  }

  useEffect(() => {
    const unsubscribe = listenForPlayer2Answer(gameID, playerID, handlePlayer2Answer);

    return () => unsubscribe();
  }, [gameID]);

  const handlePlayer2Answer = (player2Answer) => {
    setSecondPlayerAnswered(true);
    setSecondPlayerAnswer(player2Answer);
  };

  useEffect(() => {
    const unsubscribe = listenForPlayer2Vote(gameID, handlePlayer2Vote);

    return () => unsubscribe();
    }, [gameID]);

    const handlePlayer2Vote = (score) => {
      setScore(score);
      restart(gameID);
      
    };

    const handleVote = async (bool) => {

      let points = 0;

      if (bool){
        points = 1;
      } else {
  
      }
  
      setVoted(true);
      const result = await submitVote(gameID, playerID, points);
 
    };

    const restart = async (gameID) => {
      setCurrentQuestion('');
      setQuestionNumber(prevCount  => prevCount + 1);
      setAnswer('');
      setSecondPlayerAnswer('');
      setQuestionAnswered(false);
      setSecondPlayerAnswered(false);
      setVoted(false);
      setSecondPlayerVoted(false);

      const result = await resetRound(gameID);

      if (playerID === 1) {
        generateQuestionForGame(gameID);
      }
    }  

  return (
    <div className='MenuContainerOuter'>
        {(!secondPlayerAnswered) && <QuestionComponent 
          currentQuestion={currentQuestion}
          answer={answer} setAnswer={setAnswer}
          handleSubmit={handleSubmit}
          questionNumber={questionNumber}
          score={score}
          questionAnswered={questionAnswered}
          secondPlayerName={secondPlayerName}
          playerName={playerName}
          playerID={playerID}/>}

        {questionAnswered && secondPlayerAnswered && <VotingCompoent
        currentQuestion={currentQuestion}
        answer={answer}
        secondPlayerAnswer={secondPlayerAnswer}
        handleVote={handleVote}
        voted={voted}
        questionNumber={questionNumber}
        score={score}
        playerName={playerName}
        secondPlayerName={secondPlayerName}
        playerID={playerID}/>}
    </div>
  )
}

export default Game