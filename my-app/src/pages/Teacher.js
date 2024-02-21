import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher() {
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  //const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem('answers')) || ['']);
  const [solution, setSolution] = useState(localStorage.getItem('solution') || '');
  // const [points, setPoints] = useState(localStorage.getItem('points') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const [answers, setAnswers] = useState(localStorage.getItem('answers')?.split(',') || ['']);
  const [newAnswer, setNewAnswer] = useState('');
  // const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answers:[] , solution: '' , points: '', score: '', graded: false, changes: [], render: ''});
  const [newQuestion, setNewQuestion] = useState({ style: '', title: '', content: '', answers:[] , solution: '' , score: '', graded: false, showingSolution: false, changes: [], render: '', studentAnswer: '', edited: false, points: ''});
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [filename, setFilename] = useState('questions.txt');

  const handleImport = (event) => {

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const blocks = event.target.result.split('\n----Style');
      const questions = [];
      const existingQuestions = JSON.parse(localStorage.getItem('questions')) || [];

      for (const block of blocks) {
        if (block.trim() === '') continue;
        const lines = block.split('\n');
        const styleLine = lines[0].split(': ');
        const titleLine = lines[1].split('----Question: ');
        const contentLine = lines[2].split('----Content: ');
        const answersLine = lines[3].split('----Answers: ');
        const solutionLine = lines[4].split('----Solution: ');

        if (styleLine[1] && titleLine[1] && contentLine[1] && answersLine[1] && solutionLine[1]) {
          const style = styleLine[1].trim().toLowerCase();
          const title = titleLine[1];
          const content = contentLine[1];
          const answers = answersLine[1].split('||');
          const solution = solutionLine[1];
          questions.push({ style, title, content, answers, solution });
        }
        else{
          alert('Invalid file format');
          console.log(styleLine[1], titleLine[1], contentLine[1], answersLine[1], solutionLine[1])
          return;
        
        }
      }
      setQuestions([...existingQuestions, ...questions]);
    };

    reader.readAsText(file);
  };


  const handleExport = (filename) => {
    const content = questions.map(question =>
      `----Style: ${question.style}\n----Question: ${question.title}\n----Content: ${question.content}\n----Answers: ${question.answers.join('||')}`
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
    //setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    let value = e.target.value;
    if (e.target.name === 'answers') {
      value = value.split(','); // or another delimiter of your choice
    }
    setNewQuestion({ ...newQuestion, [e.target.name]: value });
  }

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...newQuestion.answers];
    newAnswers[index] = e.target.value;
    setNewQuestion({ ...newQuestion, answers: newAnswers });
  };

  // function handleAddAnswer() {
  //   setQuestions(prevQuestions => prevQuestions.map((question, index) => {
  //     if (index === selectedQuestionIndex) {
  //       return {...question, answers: [...question.answers, newAnswer]};
  //     } else {
  //       return question;
  //     }
  //   }));
  //   setAnswers([]);
  // }

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
    //localStorage.setItem('points', points);
  }, [title, content, answers]);


  function handleSubmit(e) {
    e.preventDefault();
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
              {/* <p>The answers are: {question.answers}</p> */}
              {/* //this needs to be multiple if there is more than 1 answer */}
              <p>The answers are: {question.answers.join(', ')}</p>
              <p>The style is: {question.style}</p>
              {/* <p>The points are: {question.points}</p> */}
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