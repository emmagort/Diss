import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// Define a new renderer for code blocks
const renderers = {
  code: ({language, value}) => {
    const validLanguage = Prism.languages[language] ? language : 'none';
    const highlighted = Prism.highlight(value, Prism.languages[validLanguage], validLanguage);
    return <pre dangerouslySetInnerHTML={{__html: highlighted}} />
  }
};

export default function Student(){
  const location = useLocation();
  // const { title } = location.state;
  // const { content } = location.state;
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);


  function handleHighlight() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.modify('extend', 'forward', 'word');
    const selectedWord = selection.toString();
    if (selectedWord === answer) {
      alert('Correct!');
    }
    else {
      alert('Incorrect!');
    }
    let range = selection.getRangeAt(0);
    let span = document.createElement('span');
    span.style.border = `2px solid ${highlightColor}`;
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  // HIGHLIGHT INSTEAD OF BOX
  //   let mark = document.createElement('mark');
  //   mark.style.backgroundColor = highlightColor;
  //   mark.appendChild(range.extractContents());
  //   range.insertNode(mark);
  // }

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index} className={question.style}>
          <h1>The question is: {question.title}</h1>
          <p contentEditable={true} onMourseUp={handleHighlight}>{question.content}</p>
        </div>
      ))}

      <label>
        Select highlight color:
        <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} />
      </label> 

    </div>
  );
}


