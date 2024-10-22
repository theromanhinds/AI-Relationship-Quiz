import React from 'react'
import { useState, useEffect } from 'react'

import QuestionComponent from './GameComponents/QuestionComponent'
import VotingCompoent from './GameComponents/VotingCompoent';

import { listenForPlayer2Answer, submitAnswer, listenForPlayer2Vote, resetRound, submitVote, listenForQuestion, generateQuestionForGame } from './GameFunctions';

function Game({gameID, playerID, currentQuestion, setCurrentQuestion, questionNumber}) {

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
    console.log("submitting answer " + answer);
    const result = await submitAnswer(gameID, playerID, answer);
    setQuestionAnswered(true);

  }

  useEffect(() => {
    const unsubscribe = listenForPlayer2Answer(gameID, playerID, handlePlayer2Answer);

    return () => unsubscribe();
  }, [gameID]);

  const handlePlayer2Answer = (player2Answer) => {
    console.log(`Other player submitted: ${player2Answer}`);
    setSecondPlayerAnswered(true);
    setSecondPlayerAnswer(player2Answer);
  };

  useEffect(() => {
    const unsubscribe = listenForPlayer2Vote(gameID, handlePlayer2Vote);

    return () => unsubscribe();
    }, [gameID]);

    const handlePlayer2Vote = (score) => {
      console.log(`Both players voted!`);

      setScore(score);
      restart(gameID);
      
    };

    const handleVote = async (bool) => {

      let points = 0;

      if (bool){
        points = 1;
        console.log("You voted YES!");
      } else {
        console.log("You voted NO!");
  
      }
  
      setVoted(true);
      const result = await submitVote(gameID, playerID, points);
 
    };

    const restart = async (gameID) => {
      setCurrentQuestion('');
      setAnswer('');
      setSecondPlayerAnswer('');
      setQuestionAnswered(false);
      setSecondPlayerAnswered(false);
      setVoted(false);
      setSecondPlayerVoted(false);
      const result = await resetRound(gameID);

      console.log(playerID);
      if (playerID === 1) {
        generateQuestionForGame(gameID);
      }
    }  

  return (
    <div className='MenuContainerOuter'>
        {(!questionAnswered && !secondPlayerAnswered) && <QuestionComponent 
          currentQuestion={currentQuestion}
          answer={answer} setAnswer={setAnswer}
          handleSubmit={handleSubmit}
          questionNumber={questionNumber}/>}

        {(questionAnswered && !secondPlayerAnswered) && <p className='SmallText'>Answer Submitted! Waiting for other player!</p>}

        {questionAnswered && secondPlayerAnswered && <VotingCompoent
        currentQuestion={currentQuestion}
        answer={answer}
        secondPlayerAnswer={secondPlayerAnswer}
        handleVote={handleVote}
        voted={voted}
        questionNumber={questionNumber}/>}
    </div>
  )
}

export default Game