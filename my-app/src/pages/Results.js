
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'prismjs/themes/prism.css';
import './Teacher.css';

const Results = ({ questions }) => {
  const [loaded, setLoaded] = useState(false);
  const [overallScore, setOverallScore] = useState(0); // Add state for overall score
  const totalPoints = questions.reduce((total, question) => total + question.answers.length, 0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
    calculateOverallScore(); // Calculate the initial overall score
  }, []);

  useEffect(() => {
    calculateOverallScore(); // Recalculate the overall score whenever questions change
  }, [questions]);

  function calculateOverallScore() {
    const score = questions.reduce((total, question) => total + question.score, 0);
    setOverallScore(score);
  }

  function handleReset() {
    const updatedQuestions = questions.map(question => ({
      ...question,
      graded: false,
      showingSolution: false,
      edited: false,
      render: '',
      studentAnswer: '',
      changes: [],
      score: 0
    }));

    navigate('/student', { state: { questions: updatedQuestions } });
  }

  function handleReview() {
    navigate('/student', { state: { questions } });
  }

  function handleShowScore() {
    window.refresh();
  }

  return (
    <div>
      {loaded && (
        <>
          <h1>Results</h1>
          <p>Your overall grade: {overallScore}/{totalPoints}</p>
          <button onClick={handleReset}>Retake Quiz</button>
          <button onClick={handleReview}>Review</button>
        </>
      )}
    </div>
  );
};

export default Results;
