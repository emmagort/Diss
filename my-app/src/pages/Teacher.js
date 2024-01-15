
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Teacher(){
  const [title, setTitle] = useState(localStorage.getItem('title') || '');
  const [content, setContent] = useState(localStorage.getItem('content') || '');
  const [answer, setAnswer] = useState(localStorage.getItem('answer') || '');

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('title', title);
    localStorage.setItem('content', content);
    localStorage.setItem('answer', answer);
  }, [title, content, answer]);

  function handlePartsSubmit(e) {
    e.preventDefault();
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/student', { state: { title, content, answer } });
  }

  function handleResetTitle(e) {
    e.preventDefault();
    setTitle('');
  }

  function handleResetContent(e) { 
    e.preventDefault();
    setContent('');
  }

  function handleResetAnswer(e) {
    e.preventDefault();
    setAnswer('');
  }

  function handleResetAll(e) {
    e.preventDefault();
    setTitle('');
    setContent('');
    setAnswer('');
  }

  return (
    <div>
      <form onSubmit={handlePartsSubmit}>
        <label htmlFor="title">Set Question Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetTitle}>Reset</button>
      </form>

      <form onSubmit={handlePartsSubmit}>
        <label htmlFor="content">Set Question Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="content"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetContent}>Reset</button>
      </form>

      <form onSubmit={handlePartsSubmit}>
        <label htmlFor="answer">Set Question Answer</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          id="answer"
        />
        <button type="submit" onClick={handlePartsSubmit}>Submit</button>
        <button onClick={handleResetAnswer}>Reset</button>
      </form>
      <button onClick={handleSubmit}>Preview</button>
      <button onClick={handleResetAll}>Reset All</button>
    </div>
  );
}
