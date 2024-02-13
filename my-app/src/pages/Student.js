import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'prismjs/themes/prism.css';


export default function Student() {
  const location = useLocation();
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const colors = ['#CE97FB', '#F6A5EB', '#FAA99D', '#FDDF7E', '#9BFBE1', '#67EBFA'];
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem('questions') || []));
  }, []);

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
        newNode.style.left = `${startRect.left - 5}px`;
        newNode.style.top = `${rect.top}px`;
        const width = rect.right - startRect.left;
        if (width === rect.width) {
          newNode.style.width = `${width + 15}px`;
        }
        else {
          newNode.style.width = `${width + 5}px`;
        }
        newNode.style.height = `${rect.height}px`;
        newNode.style.border = `2px solid ${highlightColor}`;
        newNode.style.pointerEvents = 'none';
        document.body.appendChild(newNode);
        setChanges(prevChanges => [...prevChanges, { type: 'box', node: newNode }]);
      }
    }
  }


  function handleHighlight() {

    const selection = window.getSelection();
    const alreadyClicked = changes.some(change => change.node.textContent === selection.toString());
    if (alreadyClicked) {
      return;
    }
    if (selection.toString().trim() !== '') {
      if (!selection.rangeCount) return;
      let range = selection.getRangeAt(0);
      let mark = document.createElement('mark');
      mark.style.backgroundColor = highlightColor;
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
      setChanges(prevChanges => [...prevChanges, { type: 'highlight', node: mark }]);
    }
  }

  function handleClickWord(event) {

    const selection = window.getSelection();
    const alreadyClicked = changes.some(change => change.node.textContent === selection.toString());
    if (alreadyClicked) {
      return;
    }
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
      setChanges(prevChanges => [...prevChanges, { type: 'clickWord', node: span }]);
    }
  }

  function handleClickLine(event) {

    const selection = window.getSelection();
    const alreadyClicked = changes.some(change => change.node.textContent === selection.toString());
    if (alreadyClicked) {
      return;
    }
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
      setChanges(prevChanges => [...prevChanges, { type: 'clickLine', node: span }]);
    }
  }
  function handleUndo() {
    if (changes.length === 0) return;
    const lastChange = changes.pop();
    if (lastChange.type === 'highlight') {
      lastChange.node.outerHTML = lastChange.node.innerHTML;
    }
    else if (lastChange.type === 'clickWord' || lastChange.type === 'clickLine' || lastChange.type === 'box') {
      lastChange.node.style.border = 'none';
    }
    setChanges([...changes]);
  }

  function handleReset() {
    while (changes.length > 0) {
      handleUndo();
    }
  }
  return (
    <div style={{ paddingLeft: '20px' }} >

      {questions.map((question, index) => (
        <div key={index}>
          <h2>{question.title}</h2>
          <p onMouseUp={
            question.style === 'highlight' ? handleHighlight :
              question.style === 'box' ? handleBox :
                question.style === 'clickWord' ? handleClickWord :
                  handleClickLine
          }
            style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', }}>
            {question.content}
          </p>
        </div>
      ))}
      <div>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleReset}>Reset All</button>
      </div>
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


