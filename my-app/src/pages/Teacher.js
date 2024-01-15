


// // Teacher.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Teacher(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/student', { state: { title, content, answer } });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Set Question Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
        />
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Set Question Content</label>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="content"
        />
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={handleSubmit}>
        <label htmlFor="answer">Set Question Answer</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          id="answer"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}