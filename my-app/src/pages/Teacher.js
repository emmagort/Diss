import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher(){
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  const [answer, setAnswer] = useState(localStorage.getItem('answer') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answer: '' });

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);


  function handleInputChange(e) {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  }

  function handleAddQuestion(e) {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ style:'', title: '', content: '', answer: '' });
  }

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('title', title);
    localStorage.setItem('content', content);
    localStorage.setItem('answer', answer);
  }, [title, content, answer]);

  // function handlePartsSubmit(e) {
  //   e.preventDefault();
  // }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/student', { state: { title, content, answer } });
  }

  // function handleResetTitle(e) {
  //   e.preventDefault();
  //   setTitle('');
  // }

  // function handleResetContent(e) { 
  //   e.preventDefault();
  //   setContent('');
  // }

  // function handleResetAnswer(e) {
  //   e.preventDefault();
  //   setAnswer('');
  // }

  // function handleResetAll(e) {
  //   e.preventDefault();
  //   setTitle('');
  //   setContent('');
  //   setAnswer('');
  // }

  function handleDeleteQuestion(index) {
    setQuestions(questions.filter((question, i) => i !== index));
  }

  function handleDeleteAllQuestions() {
    setQuestions([]);
  }

  return (
    <div>
    
      {/* <form onSubmit={handlePartsSubmit}>
        <label htmlFor="title">Set Question Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetTitle}>Reset</button>
      </form> */}

      {/* <form onSubmit={handlePartsSubmit}>
        <label htmlFor="content">Set Question Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="content"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetContent}>Reset</button>
      </form> */}
      {/* <form onSubmit={handlePartsSubmit}>
        <label htmlFor="answer">Set Question Answer</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          id="answer"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetAnswer}>Reset</button>
      </form> */}
      {questions.map((question, index) => (
        <div key={index}>
          <h1>The question is: {question.title}</h1>
          <p>The content is: {question.content}</p>
          <p>The answer is: {question.answer}</p>
          <button onClick={() => handleDeleteQuestion(index)}>Delete Question</button>
        </div>
      ))}
      <button onClick={handleSubmit}>Preview</button>
      {/* <button onClick={handleResetAll}>Reset All</button> */}
      <div>
        <input name="style" value={newQuestion.style} onChange={handleInputChange} placeholder="Style" />
        <input name="title" value={newQuestion.title} onChange={handleInputChange} placeholder="Title" />
        <input name="content" value={newQuestion.content} onChange={handleInputChange} placeholder="Content" />
        <input name="answer" value={newQuestion.answer} onChange={handleInputChange} placeholder="Answer" />
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleDeleteAllQuestions}>Delete All Questions</button>
      </div>
    </div>
  );
}
