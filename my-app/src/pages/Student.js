import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'prismjs/themes/prism.css';
import './Student.css';

export default function Student() {
  const location = useLocation();
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('#FFD700');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const colors = ['#CE97FB', '#F6A5EB', '#FAA99D', '#FDDF7E', '#9BFBE1', '#67EBFA'];
  const [changes, setChanges] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);
  
  useEffect(() => {
    localStorage.setItem('changes', JSON.stringify(changes));
  }, [changes]);

  useEffect(() => {
    const storedChanges = JSON.parse(localStorage.getItem('changes')) || [];
    setChanges(storedChanges);
  }, []);


  function goToNextQuestion() {
    if (currentQuestionIndex === questions.length - 1) {
      return;
    }
    // Hide the changes for the current question
    changes.filter(change => change.index === currentQuestionIndex).forEach((change) => {
      if (change.type === 'highlight') {
        change.node.outerHTML = change.node.textContent;
      }
    });

    // Go to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    // Show the changes for the next question
    changes.filter(change => change.index === currentQuestionIndex + 1).forEach((change) => {
      if (change.type === 'highlight') {
        change.node.outerHTML = change.originalOuterHTML;
      }
    });
    localStorage.setItem('changes', JSON.stringify(changes));
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      // Hide the changes for the current question
      changes.filter(change => change.index === currentQuestionIndex).forEach((change) => {
        if (change.type === 'highlight') {
          change.node.outerHTML = change.node.textContent;
        }
      });

      // Go to the previous question
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);

      // Show the changes for the previous question
      changes.filter(change => change.index === currentQuestionIndex - 1).forEach((change) => {
        if (change.type === 'highlight') {
          change.node.outerHTML = change.originalOuterHTML;
        }
      });
      localStorage.setItem('changes', JSON.stringify(changes));
  }
}

const currentQuestion = questions[currentQuestionIndex];



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
      setChanges(prevChanges => [...prevChanges, { type: 'box', node: newNode, index: currentQuestionIndex }]);
      localStorage.setItem('changes', JSON.stringify(changes));
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
    const originalOuterHTML = mark.outerHTML;
    mark.style.backgroundColor = highlightColor;
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
    setChanges(prevChanges => [...prevChanges, { type: 'highlight', node: mark, originalOuterHTML, index: currentQuestionIndex }]);
    localStorage.setItem('changes', JSON.stringify(changes));
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
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
    setChanges(prevChanges => [...prevChanges, { type: 'clickWord', node: span, index: currentQuestionIndex }]);
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
    setChanges(prevChanges => [...prevChanges, { type: 'clickLine', node: span, index: currentQuestionIndex }]);
  }
}

// while and checking index
function handleUndo() {
  // Get the changes for the current page
  const currentPageChanges = changes.filter(change => change.index === currentQuestionIndex);
  if (currentPageChanges.length === 0) return;
  else if (currentPageChanges.length > 0) {
    const lastChange = currentPageChanges[currentPageChanges.length - 1];

    if (lastChange.type === 'highlight') {
      lastChange.node.outerHTML = lastChange.node.innerHTML;
    }
    else if (lastChange.type === 'clickWord' || lastChange.type === 'clickLine' || lastChange.type === 'box') {
      lastChange.node.style.border = 'none';
    }
    const newChanges = changes.filter(change => change !== lastChange);
    setChanges(newChanges);
  }
}

function handleReset() {
  changes.filter(change => change.index === currentQuestionIndex).forEach((change) => {
    if (change.type === 'highlight') {
      change.node.outerHTML = change.node.innerHTML;
    }
    else if (change.type === 'clickWord' || change.type === 'clickLine' || change.type === 'box') {
      change.node.style.border = 'none';
    }
  });

  // Filter out the changes for the current question
  const newChanges = changes.filter(change => change.index !== currentQuestionIndex);
  setChanges(newChanges);
}

function checkAnswer(index) {
  const currentQuestion = questions[index];
  // if (!currentQuestion) return;
  const studentAnswer = window.getSelection().toString();
  if (studentAnswer.trim() !== '') {
    if (studentAnswer === currentQuestion.answer) {
      alert('Correct!');
    }
  }
}


return (
  <div className="game-container">
    <div >
    <div>
      <h2 className='question-title'>{currentQuestion.title}</h2>
      <p  onMouseUp={
        currentQuestion.style === 'highlight' ? handleHighlight :
          currentQuestion.style === 'box' ? handleBox :
            currentQuestion.style === 'clickWord' ? handleClickWord :
              handleClickLine
      }
        style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', }}>
        {currentQuestion.content}
      </p>
      </div>
      <div className="button-container" style={{ alignItems: 'left' }}>
        <button className='inreractive-button' onClick={() => checkAnswer(currentQuestionIndex)}>Check Answer</button>
      </div>
      <div className="interaction-controls">
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleUndo}>Undo</button>
          <button onClick={handleReset}>Reset All</button>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={goToPreviousQuestion}>Previous Question</button>
          <button onClick={goToNextQuestion}>Next Question</button>
        </div>

        <label className='color-selection'>
          {colors.map((color, index) => (
            <label key={index}>
              <input type="radio" value={color} checked={highlightColor === color} onChange={(e) => setHighlightColor(e.target.value)} />
              <span style={{ backgroundColor: color, display: 'inline-block', width: '20px', height: '20px' }}></span>
            </label>
          ))}
        </label>
      </div>
    </div>
  </div>
);
}
