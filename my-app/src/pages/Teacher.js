import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher() {
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  const [solution, setSolution] = useState(localStorage.getItem('solution') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const [answers, setAnswers] = useState(localStorage.getItem('answers')?.split(',') || ['']);
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answers:[] , solution: '' , score: '', graded: false, showingSolution: false, changes: [], render: '', studentAnswer: '', edited: false, points: ''});
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [filename, setFilename] = useState('questions.txt');

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const importedQuestions = JSON.parse(event.target.result);
      const existingQuestions = JSON.parse(localStorage.getItem('questions')) || [];
      const allQuestions = [...existingQuestions, ...importedQuestions];

      const missingFields = allQuestions.filter(question => {
        return !question.style || !question.title || !question.content || question.answers.length === 0 || !question.solution;
      });

      console.log(missingFields.length);

      if (missingFields.length > 0) {
        console.warn('Warning: Some questions in the imported file are missing fields.');
        alert("Please make sure all the questions in your file have all fields filled in." );
        return
      }

      setQuestions(allQuestions);
    };

    reader.readAsText(file);
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


  const handleExport = (filename) => {
    const exportedQuestions = questions.map(question => {
      const { style, title, content, answers, solution } = question;
      return { style, title, content, answers, solution };
    });

    const content = JSON.stringify(exportedQuestions);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    link.remove();
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
    let value = e.target.value;
    if (e.target.name === 'answers') {
      value = value.split(','); 
    }
    setNewQuestion({ ...newQuestion, [e.target.name]: value });
  }

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...newQuestion.answers];
    newAnswers[index] = e.target.value;
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };


  const handleAddAnswer = () => {
    setNewQuestion({ ...newQuestion, answers: [...newQuestion.answers, ''] });
  };

  function handleAddQuestion(e) {
    if (!newQuestion.style || !newQuestion.title || !newQuestion.content || newQuestion.answers.length === 0 || !newQuestion.solution) {
      alert("Please fill in all the fields before adding a question.");
      return;
    }
    let newQuestions = [...questions];
    if (editingIndex !== null) {
      newQuestions.splice(editingIndex, 0, newQuestion);
      setQuestions(newQuestions);
      setNewQuestion({ style: '', title: '', content: '', answers: [...answers], solution: ''});
      setEditingIndex(null);
    }
    else {
      setQuestions([...questions, newQuestion]);
    }
    setAnswers([]);
    setNewQuestion({ style: '', title: '', content: '', answers: [...answers], solution: ''});
  }
  

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('title', title);
    localStorage.setItem('content', content);
    localStorage.setItem('answers', answers);
    localStorage.setItem('solution', solution);
  }, [title, content, answers]);


  function handleSubmit(e) {
    e.preventDefault();
    if (questions.length === 0) {
      alert("Please create at least one question before submitting.");
      return;
    }
    navigate('/student', { state: { title, content, answers, solution } });
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
    const confirmDelete = window.confirm("Are you sure you want to delete all questions?");
    if (confirmDelete) {
      setQuestions([]);
    }
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
              <p>The answers are: {question.answers.join(', ')}</p>
              <p>The style is: {question.style}</p>
              <p>The solution is: {question.solution}</p>
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
          <option value="clickword">Click Word</option>
          <option value="clickline">Click Line</option>
        </select>
        <input name="title" value={newQuestion.title} onChange={handleInputChange} placeholder="Title" />
        <textarea name="content" value={newQuestion.content} onChange={handleInputChange} style={{ whiteSpace: 'pre-wrap' }} placeholder="Content" />
        {newQuestion.answers.map((answer, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <textarea
            style={{ whiteSpace: 'pre-wrap' }}
            key={index}
            name="answers"
            value={answer}
            onChange={(e) => handleAnswerChange(e, index)}
            placeholder="New Answer"
          />
          {!newQuestion.content.includes(answer) && <span style={{ color: 'red' }} title = "This answer is not contained in the question content.">❗</span>}
          </div>
        ))}
        <button onClick={handleAddAnswer}>Add another answer</button>
        <textarea name="solution" value={newQuestion.solution} onChange={handleInputChange} style={{ whiteSpace: 'pre-wrap' }} placeholder="Solution" />
        {/* <input name="points" value={newQuestion.points} onChange={handleInputChange} placeholder="Points" /> */}
        <button onClick={handleAddQuestion}>{editingIndex !== null ? 'Update Question' : 'Add Question'}</button>
        <button onClick={handleDeleteAllQuestions}>Delete All Questions</button>
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