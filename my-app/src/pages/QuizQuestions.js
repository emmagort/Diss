import { useState } from 'react';

function Quiz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = JSON.parse(localStorage.getItem('questions')) || [];

    function goToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h1>Question {currentQuestionIndex + 1}</h1>
            <p>{currentQuestion}</p>

            <button onClick={goToPreviousQuestion}>Previous</button>
            <button onClick={goToNextQuestion}>Next</button>
        </div>
    );
}

export default Quiz;