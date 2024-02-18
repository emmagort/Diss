import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher() {
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  const [answer, setAnswer] = useState(localStorage.getItem('answer') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answer: '' , changes: [], render: ''});
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [filename, setFilename] = useState('questions.txt');

  const handleImport = (event) => {

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const blocks = event.target.result.split('\n----Style:');
      const questions = [];
      const existingQuestions = JSON.parse(localStorage.getItem('questions')) || [];

      for (const block of blocks) {
        if (block.trim() === '') continue;

        const lines = block.split('\n');
        const style = lines[0].split('----Style: ')[1];
        const title = lines[1].split('----Question: ')[1];
        const content = lines[2].split('----Content: ')[1];
        const answer = lines[3].split('----Answer: ')[1];

        questions.push({ style, title, content, answer });
      }
      setQuestions([...existingQuestions, ...questions]);
    };

    reader.readAsText(file);
  };


  const handleExport = (filename) => {
    const content = questions.map(question =>
      `----Style: ${question.style}\n----Question: ${question.title}\n----Content: ${question.content}\n----Answer: ${question.answer}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    link.remove();
  };

  const handleSave = () => {
    handleExport(filename);
  };

  const handleSaveAs = () => {
    const newFilename = prompt('Enter new filename:');
    if (newFilename) {
      setFilename(newFilename);
      handleExport(newFilename);
    }
  };

  const handleTitleClick = (index) => {
    if (selectedQuestionIndex === index) {
      setSelectedQuestionIndex(null);
    } else {
      setSelectedQuestionIndex(index);
    }
  };


  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);




  function handleInputChange(e) {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  }

  function handleAddQuestion(e) {
    if (editingIndex !== null) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ style: '', title: '', content: '', answer: '' });
      setEditingIndex(null);
    }
    else {
      setQuestions([...questions, newQuestion]);
    }
    setNewQuestion({ style: '', title: '', content: '', answer: '' });
  }

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('title', title);
    localStorage.setItem('content', content);
    localStorage.setItem('answer', answer);
  }, [title, content, answer]);


  function handleSubmit(e) {
    e.preventDefault();
    navigate('/student', { state: { title, content, answer } });
  }

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
    <div style={{ paddingLeft: '20px' }}>
      <h1>Questions</h1>
      {questions.map((question, index) => (
        <div key={index}>
          <h2 onClick={() => handleTitleClick(index)}>{question.title}</h2>
          {selectedQuestionIndex === index && (
            <>
              <p style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{question.content}</p>
              <p>The answer is: {question.answer}</p>
              <p>The style is: {question.style}</p>
              <button onClick={() => handleDeleteQuestion(index)}>Delete Question</button>
              <button onClick={() => handleEditQestion(index)}>Edit Question</button>
            </>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Preview</button>
      <div>
        <select name="style" value={newQuestion.style} onChange={handleInputChange}>
          <option value="">Select style</option>
          <option value="box">Box</option>
          <option value="highlight">Highlight</option>
          <option value="clickWord">Click Word</option>
          <option value="clickLine">Click Line</option>
        </select>
        <input name="title" value={newQuestion.title} onChange={handleInputChange} placeholder="Title" />
        <textarea name="content" value={newQuestion.content} onChange={handleInputChange} style={{ whiteSpace: 'pre-wrap' }} placeholder="Content" />
        <input name="answer" value={newQuestion.answer} onChange={handleInputChange} placeholder="Answer" />
        <button onClick={handleAddQuestion}>{editingIndex !== null ? 'Update Question' : 'Add Question'}</button>
        <button onClick={handleDeleteAllQuestions}>Delete All Questions</button>
        <input type="file" onChange={handleImport} />
      </div>
      <div>
        <input type="file" onChange={handleImport} />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleSaveAs}>Save As</button>
      </div>
    </div>
  );
}