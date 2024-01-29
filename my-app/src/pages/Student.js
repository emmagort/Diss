import React, { useState, useEffect } from 'react';
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
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);

  //Something else
  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem('questions') || []));
  }, []); 

  function handleColorChange(e) {
    setHighlightColor(e.target.value);
  }

  // function handleHighlight(content, answer) {
  //   return content.split(' ').map((word, index) => (
  //     <span key={index} style={word === answer ? { backgroundColor: highlightColor } : {}}>
  //       {word}
  //     </span>
  //   ));
  // }


  function handleBox(content, answer) {
    return content.split(' ').map((word, index) => (
      <span key={index} style={word === answer ? { border: `2px solid ${highlightColor}` } : {}}>
        {word}
      </span>
    ));
  }
  
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

  // function handleCheckAnswer(answer) {
  //   if (selection.trim() === answer) {
  //     alert('Correct!');
  //   } else {
  //     alert('Incorrect!');
  //   }
  // }

  function handleBox() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const newNode = document.createElement('span');
      newNode.style.display = 'inline-block';
      newNode.style.maxWidth = 'fit-content';
      newNode.style.border = `2px solid ${highlightColor}`;
      newNode.appendChild(range.extractContents());
      range.insertNode(newNode);
    }
  }

  // HIGHLIGHT INSTEAD OF BOX
  //   let mark = document.createElement('mark');
  //   mark.style.backgroundColor = highlightColor;
  //   mark.appendChild(range.extractContents());
  //   range.insertNode(mark);
  // }

  return (
    <div>
    <input type="color" value={highlightColor} onChange={handleColorChange} />

    {questions.map((question, index) => (
      <div key={index}>
        <h1>The question is: {question.title}</h1>
        <h2 onMouseUp={handleBox}>
          {question.content.split('\n').map((line, i) => 
            <span key={i}>
              {line}
              <br/>
            </span>
          )}
          </h2>
      </div>
    ))}

      <label>
        Select highlight color:
        <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} />
      </label> 

    </div>
  );
}


