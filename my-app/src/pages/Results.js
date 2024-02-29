
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'prismjs/themes/prism.css';
import './Teacher.css';

const Results = ({ questions }) => {
  const [loaded, setLoaded] = useState(false);
  const [overallScore, setOverallScore] = useState(0); // Add state for overall score
  const totalPoints = questions.reduce((total, question) => total + question.answers.length, 0);
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false); // Add this line

  useEffect(() => {
    setLoaded(true);
    calculateOverallScore(); // Calculate the initial overall score
    const showResultsFromStorage = localStorage.getItem('showResults'); // Get showResults from local storage
    if (showResultsFromStorage === 'true') {
      setShowResults(true); // If showResults is true in local storage, set the state to true
    }
  }, []);

  useEffect(() => {
    calculateOverallScore(); // Recalculate the overall score whenever questions change
  }, [questions]);

  function calculateOverallScore() {
    const score = questions.reduce((total, question) => total + question.score, 0);
    setOverallScore(score);
  }

  
    function handleShowScore() {
      setShowResults(true); // Add this line
      localStorage.setItem('showResults', 'true');
      window.location.reload();
      
    }
  



  function handleReset() {
    const resetQuestions = questions.map(question => ({
      ...question,
      graded: false,
      showingSolution: false,
      edited: false,
      render: '',
      studentAnswer: '',
      changes: [],
      score: 0

    }));
    localStorage.setItem('showResults', 'false');
    localStorage.setItem('questions', JSON.stringify(resetQuestions));
    navigate('/student', { state: { questions: resetQuestions } });
    //window.location.href = '/#/student';

  }
  

  function handleReview() {
    navigate('/student', { state: { questions } });
  }

  // function handleShowScore() {
  //   window.refresh();
  // }

  return (
    <div>
      {loaded && (
        <>
          <h1>Results</h1>
          <p hidden={!showResults}>Your overall grade: {overallScore}/{totalPoints}</p>
          <button hidden = {showResults} onClick={handleShowScore}>Show Results</button>
          <div hidden = {!showResults}>
          <button onClick={handleReset}>Retake Quiz</button>
          <button onClick={handleReview}>Review</button>
          </div>
  
        </>
      )}
    </div>
  );
};

export default Results;
