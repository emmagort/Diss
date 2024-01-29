import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher(){
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  const [answer, setAnswer] = useState(localStorage.getItem('answer') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answer: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);


  function handleInputChange(e) {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  }

  function handleAddQuestion(e) {
    if (editingIndex !== null) {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ style:'', title: '', content: '', answer: '' });
    setEditingIndex(null);
    }
    else {
      setQuestions([...questions, newQuestion]);
    }
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

  function handleEditQestion(index) {
    setNewQuestion(questions[index]);
    setQuestions(questions.filter((_, i) => i !== index));
    setEditingIndex(index);
  }

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
          <p style={{whiteSpace:'pre-wrap'}}>The content is: {question.content}</p>
          <p>The answer is: {question.answer}</p>
          <button onClick={() => handleDeleteQuestion(index)}>Delete Question</button>
          <button onClick={() => handleEditQestion(index)}>Edit Question</button>
        </div>
      ))}
      <button onClick={handleSubmit}>Preview</button>
      {/* <button onClick={handleResetAll}>Reset All</button> */}
      <div>
        <select name="style" value={newQuestion.style} onChange={handleInputChange}>
          <option value="">Select style</option>
          <option value="box">Box</option>
          <option value="highlight">Highlight</option>
        </select>
        <input name="title" value={newQuestion.title} onChange={handleInputChange} placeholder="Title" />
        <textarea name="content" value={newQuestion.content} onChange={handleInputChange} style={{whiteSpace: 'pre-wrap'}} placeholder="Content" />
        <input name="answer" value={newQuestion.answer} onChange={handleInputChange} placeholder="Answer" />
        <button onClick={handleAddQuestion}>{editingIndex !== null ? 'Update Question' : 'Add Question'}</button>
        <button onClick={handleDeleteAllQuestions}>Delete All Questions</button>
      </div>
    </div>
  );
}
