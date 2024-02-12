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
  const colors = ['#CE97FB', '#F6A5EB', '#FAA99D', '#FDDF7E', '#9BFBE1', '#67EBFA'];

  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem('questions') || []));
  }, []); 

  
  // function handleHighlight() {
  //   const selection = window.getSelection();
  //   if (!selection.rangeCount) return;
  //   selection.modify('extend', 'forward', 'word');
  //   const selectedWord = selection.toString();
  //   if (selectedWord === answer) {
  //     alert('Correct!');
  //   }
  //   else {
  //     alert('Incorrect!');
  //   }
  //   let range = selection.getRangeAt(0);
  //   let span = document.createElement('span');
  //   span.style.border = `2px solid ${highlightColor}`;
  //   span.appendChild(range.extractContents());
  //   range.insertNode(span);
  // }

  // function handleCheckAnswer(answer) {
  //   if (selection.trim() === answer) {
  //     alert('Correct!');
  //   } else {
  //     alert('Incorrect!');
  //   }
  // }

  function handleBox() {
    const selection = window.getSelection();
  if (selection.toString().trim() !== '') {
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const startRange = document.createRange();
    startRange.setStart(range.startContainer, range.startOffset);
    startRange.setEnd(range.startContainer, range.startOffset + 1);
    const startRect = startRange.getBoundingClientRect();

    const newNode = document.createElement('div');
    newNode.style.position = 'absolute';
    newNode.style.left = `${startRect.left-5}px`;
    newNode.style.top = `${rect.top}px`;
    const width = rect.right - startRect.left;
    if (width === rect.width){
      newNode.style.width = `${width + 15}px`;
    }
    else {
      newNode.style.width = `${width + 5}px`; 
    }
    newNode.style.height = `${rect.height}px`;
    newNode.style.border = `2px solid ${highlightColor}`;
    newNode.style.pointerEvents = 'none';
    document.body.appendChild(newNode);
    }
  }
  }



  function handleHighlight() {
    const selection = window.getSelection();
    if (selection.toString().trim() !== '') {
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let mark = document.createElement('mark');
    mark.style.backgroundColor = highlightColor;
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
    }
  }

function handleClickWord(event) {
  
  const selection = window.getSelection();
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  selection.removeAllRanges();
  selection.addRange(range);
  selection.modify('move', 'backward', 'word');
  selection.modify('extend', 'forward', 'word');

  if (selection.toString().trim() !== '') {
    const span = document.createElement('span');
    span.style.border = `2px solid ${highlightColor}`;
    span.appendChild(document.createTextNode(selection.toString()));
    selection.getRangeAt(0).deleteContents();
    selection.getRangeAt(0).insertNode(span);
  }
}

function handleClickLine(event) {
  const selection = window.getSelection();
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  selection.removeAllRanges();
  selection.addRange(range);
  selection.modify('move', 'backward', 'lineboundary');
  selection.modify('extend', 'forward', 'lineboundary');

  if (selection.toString().trim() !== '') {
    const span = document.createElement('span');
    span.style.border = `2px solid ${highlightColor}`;
    span.appendChild(document.createTextNode(selection.toString()));
    selection.getRangeAt(0).deleteContents();
    selection.getRangeAt(0).insertNode(span);
  }
}

  return (
    <div style={{ paddingLeft: '20px' }} >

    {questions.map((question, index) => (
      <div key={index}>
        <h1>The question is: {question.title}</h1>
        <p onMouseUp={
            question.style === 'highlight' ? handleHighlight :
            question.style === 'box' ? handleBox :
            question.style === 'clickWord' ? handleClickWord :
            handleClickLine
          } 
        style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace',}}>
          {question.content}
          </p>
      </div>
    ))}

    <label>
      Select highlight color:
      {colors.map((color, index) => (
        <label key={index}>
          <input type="radio" value={color} checked={highlightColor === color} onChange={(e) => setHighlightColor(e.target.value)} />
          <span style={{ backgroundColor: color, display: 'inline-block', width: '20px', height: '20px' }}></span>
        </label>
      ))}
    </label> 

    </div>
  );
}


