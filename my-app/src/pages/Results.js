// Results.js
import React, { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'prismjs/themes/prism.css';
import './Student.css';
import './Teacher.css';

const Results = ({ questions }) => {
  // Calculate the overall grade based on your scoring logic
  const overallScore = questions.reduce((total, question) => total + question.score, 0);
  const totalPoints = questions.reduce((total, question) => total + question.answers.length, 0);
  const navigate = useNavigate();

  function handleReset() {
    // Reset the state of the quiz
    // for each question, set the selected studentAnswer and changes to null
    const updatedQuestions = questions.map(question => ({
      ...question,
      graded: false,
      showingSolution: false,
      edited: false,
      render : '',
      studentAnswer: '',
      changes: [],
      score: 0
    }));

    navigate('/student', { state: { questions: updatedQuestions } });
    
  }

  function handleReview() {
    //redirect to the student page without making any changes
    navigate('/student', { state: { questions } });
  }

  return (
    <div>
      <h1>Results</h1>
      <p>Your overall grade: {overallScore}/{totalPoints}</p>
      <button onClick={handleReset}>Retake Quiz</button>
      <button onClick={handleReview}>Review</button>
    </div>
  );
};

export default Results;
