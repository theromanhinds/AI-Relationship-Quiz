import React from 'react'
import { useState, useEffect } from 'react'

import QuestionComponent from './GameComponents/QuestionComponent'
import VotingCompoent from './GameComponents/VotingCompoent';

import { listenForPlayer2Answer, submitAnswer, listenForPlayer2Vote, resetRound, submitVote, listenForQuestion, generateQuestionForGame } from './GameFunctions';

function Game({gameID, playerID, currentQuestion, setCurrentQuestion}) {

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
    e.preventDefault();
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
      setAnswer('');
      setSecondPlayerAnswer('');
      setQuestionAnswered(false);
      setSecondPlayerAnswered(false);
      setVoted(false);
      setSecondPlayerVoted(false);
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
      const result = await resetRound(gameID);
      generateQuestionForGame(gameID);
    }  

  return (
    <div>
        <div>You are in Room {gameID} | You are {playerID}.</div>
        <p>Score || Player1: {score[0]} | Player2: {score[1]}</p>
        
        {(!questionAnswered && !secondPlayerAnswered) && <QuestionComponent 
          currentQuestion={currentQuestion}
          answer={answer} setAnswer={setAnswer}
          handleSubmit={handleSubmit}/>}

        {(questionAnswered && !secondPlayerAnswered) && <p>Answer Submitted! Waiting for player2!</p>}

        {questionAnswered && secondPlayerAnswered && <VotingCompoent
        currentQuestion={currentQuestion}
        answer={answer}
        secondPlayerAnswer={secondPlayerAnswer}
        handleVote={handleVote}
        voted={voted}/>}
    </div>
  )
}

export default Game