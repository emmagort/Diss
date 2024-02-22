import React, { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'prismjs/themes/prism.css';
import './Student.css';
import './Teacher.css';
import Results from './Results';

export default function Student() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('#FDDF7E');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || []);
  const colors = ['#CE97FB', '#F6A5EB', '#FAA99D', '#FDDF7E', '#9BFBE1', '#67EBFA'];
  const [changes, setChanges] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // const newNode = useRef(null);
  // useEffect(() => {
  //   const handleResize = () => {
  //     // Update the position of the box based on the new window dimensions
  //     if (newNode.current) {
  //     const updatedRect = newNode.getBoundingClientRect();
  //     newNode.style.left = `${updatedRect.left - 5}px`;
  //     newNode.style.top = `${updatedRect.top}px`;
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     // Clean up the event listener when the component unmounts
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

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

  


  // useEffect(() => {
  //   // Get the undo button
  //   const undoButton = document.getElementById('undoButton');

  //   // Get the changes for the current page
  //   const currentPageChanges = changes.filaater(change => change.index === currentQuestionIndex);

  //   // Disable the undo button if there are no changes for the current page, enable it otherwise
  //   undoButton.disabled = currentPageChanges.length === 0;
  // }, [changes, currentQuestionIndex]);


  function goToNextQuestion() {
    console.log('Hello world!');
    if (currentQuestionIndex === questions.length - 1) {
      //return;
      navigate('/results', { state: { questions } }); 
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    if (location.pathname === '/results') {
      return <Results questions={location.state.questions} />;
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  }

  const currentQuestion = questions[currentQuestionIndex];



  // function handleBox() {

  //   if (currentQuestion.graded === true) {
  //     return;
  //   }
  //   const selection = window.getSelection();
  //   if (selection.toString().trim() !== '') {
  //     const text = selection.toString();
  //     if (selection.rangeCount > 0) {
  //       const range = selection.getRangeAt(0);
  //       const rect = range.getBoundingClientRect();

  //       const startRange = document.createRange();
  //       startRange.setStart(range.startContainer, range.startOffset);
  //       startRange.setEnd(range.startContainer, range.startOffset + 1);
  //       const startRect = startRange.getBoundingClientRect();

  //       const newNode = document.createElement('div');
  //       newNode.style.position = 'absolute';
  //       newNode.style.left = `${startRect.left - 5}px`;
  //       newNode.style.top = `${rect.top}px`;
  //       const width = rect.right - startRect.left;
  //       if (width === rect.width) {
  //         newNode.style.width = `${width + 15}px`;
  //       }
  //       else {
  //         newNode.style.width = `${width + 5}px`;
  //       }
  //       newNode.style.height = `${rect.height}px`;
  //       newNode.style.border = `2px solid ${highlightColor}`;
  //       newNode.style.pointerEvents = 'none';
  //       const questionContainer = document.getElementById('questionContent');
  //       questionContainer.appendChild(newNode);
  //       const prevColor = highlightColor;

  //       const newChange = { type: 'box', color: prevColor, content: text };
  //       setQuestions(prevQuestions => {
  //         const updatedQuestions = [...prevQuestions];
  //         updatedQuestions[currentQuestionIndex] = {
  //           ...currentQuestion,
  //           changes: currentQuestion.changes ? [...currentQuestion.changes, newChange] : [newChange]
  //         };
  //         questions[currentQuestionIndex]['edited'] = true;
  //         questions[currentQuestionIndex]['render'] = document.getElementById('questionContent').innerHTML;
  //         console.log(document.getElementById('questionContent').innerHTML);
  //         return updatedQuestions;
  //       });
  //     }
  //   }
  // }

  function handleBox() {
    if (currentQuestion.graded === true) {
      return;
    }
    const selection = window.getSelection();
    if (selection.toString().trim() !== '') {
      const text = selection.toString();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const startRange = document.createRange();
        startRange.setStart(range.startContainer, range.startOffset);
        startRange.setEnd(range.startContainer, range.startOffset + 1);
        const startRect = startRange.getBoundingClientRect();

        const newNode = document.createElement('div');
        newNode.className = 'box';
        newNode.style.position = 'absolute';

        // Get the parent container
        const container = document.getElementById('questionContent');
        container.style.position = 'relative';

        // Get the bounding rectangle of the parent container
        const containerRect = container.getBoundingClientRect();

        // Calculate the position of the box relative to the parent container
        const left = startRect.left - containerRect.left;
        const top = rect.top - containerRect.top;

        newNode.style.left = `${left - 5}px`;
        newNode.style.top = `${top}px`;
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
        const questionContainer = document.getElementById('questionContent');
        questionContainer.appendChild(newNode);
        const prevColor = highlightColor;

        const newChange = { type: 'box', color: prevColor, content: text };
        setQuestions(prevQuestions => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[currentQuestionIndex] = {
            ...currentQuestion,
            changes: currentQuestion.changes ? [...currentQuestion.changes, newChange] : [newChange]
          };
          questions[currentQuestionIndex]['edited'] = true;
          questions[currentQuestionIndex]['render'] = document.getElementById('questionContent').innerHTML;
          console.log(document.getElementById('questionContent').innerHTML);
          return updatedQuestions;
        });
      }
    }
  }




  function handleHighlight() {
    if (currentQuestion.graded === true) {
      return;
    }
    const selection = window.getSelection();
    //const alreadyClicked = currentQuestion.changes && currentQuestion.changes.some(change => change.node.textContent === selection.toString());

    //if (alreadyClicked) {
    //return;
    //}

    if (selection.toString().trim() !== '') {
      if (!selection.rangeCount) return;
      const text = selection.toString();
      // const changes = currentQuestion.changes;
      // const alreadyHighlighted = changes.some(change => change.content === selection.toString());
      // if (alreadyHighlighted) {
      //   return;
      // }

      let range = selection.getRangeAt(0);
      let rangeData = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      }

      let mark = document.createElement('mark');
      mark.style.backgroundColor = highlightColor;
      const prevColor = mark.style.backgroundColor;
      mark.appendChild(range.extractContents());
      range.insertNode(mark);

      // const newChange = { type: 'highlight', node: mark, range: rangeData, color: prevColor };
      //const newChange = { type: 'highlight', node: mark, range: range, color: prevColor };
      const newChange = { type: 'highlight', color: prevColor, content: text };

      // Update the currentQuestion with the new change
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQuestion,
          changes: currentQuestion.changes ? [...currentQuestion.changes, newChange] : [newChange]
        };
        questions[currentQuestionIndex]['edited'] = true;
        questions[currentQuestionIndex]['render'] = document.getElementById('questionContent').innerHTML;
        console.log(document.getElementById('questionContent').innerHTML);
        return updatedQuestions;
      });

      // Clear the selection
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

    if (currentQuestion.graded === true) {
      return;
    }

    const selection = window.getSelection();

    const range = document.caretRangeFromPoint(event.clientX, event.clientY);
    selection.removeAllRanges();
    selection.addRange(range);
    selection.modify('move', 'backward', 'word');
    selection.modify('extend', 'forward', 'word');
    // const changes = currentQuestion.changes;
    // const alreadyClicked = changes.some(change => change.content === selection.toString());
    // if (alreadyClicked) {
    //   return;
    // }

    if (selection.toString().trim() !== '') {
      const text = selection.toString();
      const span = document.createElement('span');
      span.style.border = `2px solid ${highlightColor}`;
      const prevColor = highlightColor;
      span.appendChild(document.createTextNode(selection.toString()));
      selection.getRangeAt(0).deleteContents();
      selection.getRangeAt(0).insertNode(span);
      //setChanges(prevChanges => [...prevChanges, { type: 'clickWord', node: span, index: currentQuestionIndex }]);
      const newChange = { type: 'clickWord', color: prevColor, content: text };
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQuestion,
          changes: currentQuestion.changes ? [...currentQuestion.changes, newChange] : [newChange]
        };
        questions[currentQuestionIndex]['edited'] = true;
        questions[currentQuestionIndex]['render'] = document.getElementById('questionContent').innerHTML;
        console.log(document.getElementById('questionContent').innerHTML);
        return updatedQuestions;
      });
    }
  }

  function handleClickLine(event) {
    if (currentQuestion.graded === true) {
      return;
    }
    const selection = window.getSelection();
    const range = document.caretRangeFromPoint(event.clientX, event.clientY);
    selection.removeAllRanges();
    selection.addRange(range);
    selection.modify('move', 'backward', 'lineboundary');
    selection.modify('extend', 'forward', 'lineboundary');

    // const changes = currentQuestion.changes;
    // const alreadyClicked = changes.some(change => change.content === selection.toString());
    // if (alreadyClicked) {
    //   return;
    // }

    if (selection.toString().trim() !== '') {
      const text = selection.toString();
      const span = document.createElement('span');
      span.style.border = `2px solid ${highlightColor}`;
      const prevColor = highlightColor;
      span.appendChild(document.createTextNode(selection.toString()));
      selection.getRangeAt(0).deleteContents();
      selection.getRangeAt(0).insertNode(span);
      //setChanges(prevChanges => [...prevChanges, { type: 'clickLine', node: span, index: currentQuestionIndex }]);
      const newChange = { type: 'clickLine', color: prevColor, content: text };
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentQuestionIndex] = {
          ...currentQuestion,
          changes: currentQuestion.changes ? [...currentQuestion.changes, newChange] : [newChange]
        };
        questions[currentQuestionIndex]['render'] = document.getElementById('questionContent').innerHTML;
        questions[currentQuestionIndex]['edited'] = true;
        //console.log(document.getElementById('questionContent').innerHTML);
        return updatedQuestions;

      });
    }
  }


  function handleReset() {
    document.getElementById('questionContent').innerHTML = questions[currentQuestionIndex].content;
    questions[currentQuestionIndex]['render'] = '';
    questions[currentQuestionIndex]['changes'] = [];
    questions[currentQuestionIndex]['edited'] = false;
  }


  function showSolution(currentQuestion, questionContent ) {
    questionContent.innerHTML = currentQuestion.solution;
    currentQuestion.showingSolution = true;
  }

  function showAnswer(currentQuestion, questionContent) {
    questionContent.innerHTML = currentQuestion.studentAnswer;
    currentQuestion.showingSolution = false;
  }
    

  function handleChange(){
    const currentQuestion = questions[currentQuestionIndex];
    const studentAnswer = currentQuestion.studentAnswer;
    const questionContent = document.getElementById('questionContent');
    //const questionContent = document.getElementById('questionContent');
    if (currentQuestion.showingSolution === true){
      showAnswer(currentQuestion, questionContent);
    }
    else{
      showSolution(currentQuestion, questionContent);
    }
  }
  

  function checkAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const answers = (currentQuestion.answers || []).map(ans => ans.replace(/[\s.,!?]/g, ''));
    console.log(answers);
    const changes = currentQuestion.changes;
    console.log(changes);

    let score = 0;
    changes.forEach(change => {
      console.log(change.content.replace(/[\s.,!?]/g, ''));
      if (answers.includes(change.content.replace(/[\s.,!?]/g, ''))) {
        score += 1;
      } else {
        score -= 0.5;
      }
    });

    currentQuestion.score = score;
    currentQuestion.graded = true;

    console.log(score);
    currentQuestion.studentAnswer = document.getElementById('questionContent').innerHTML;
    setQuestions(prevQuestions => [...prevQuestions]); // Trigger re-render
  }



  return (
    <div className="game-container">
    {/* // <div style ={{ paddingLeft: '20px',  */}
    {/* // position: 'fixed', 
    // width: '100%', 
    // height: '100vh', 
    // overflow: 'auto' }} > */}
      <div >
        <div>
          <h2 className='question-title'>{currentQuestion.title}</h2>

          {currentQuestion.edited ? (
            <p id="questionContent" onMouseUp={
              currentQuestion.style === 'highlight' ? handleHighlight :
                currentQuestion.style === 'box' ? handleBox :
                  currentQuestion.style === 'clickword' ? handleClickWord :
                    handleClickLine
            }
              style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.render }}
            />
          ) : (
            <p id="questionContent" onMouseUp={
              currentQuestion.style === 'highlight' ? handleHighlight :
                currentQuestion.style === 'box' ? handleBox :
                  currentQuestion.style === 'clickword' ? handleClickWord :
                    handleClickLine
            }
              style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
            />
          )}
        </div>
        <p>Score: {currentQuestion.score}/{currentQuestion.answers.length}</p>
        <div className="button-container" style={{ alignItems: 'left' }}>
          <button className='inreractive-button' onClick={checkAnswer} disabled={currentQuestion.graded}>Check Answer</button>
          <button className='inreractive-button' onClick={handleChange} disabled={!currentQuestion.graded}>Question/Solution</button>
          {/* <button className='inreractive-button' onClick={showSolution} disabled={!currentQuestion.graded}>Question/Solution</button> */}
          {/* <button className='inreractive-button' onClick={showSolution} disabled={!currentQuestion.graded}>{currentQuestion.showingSolution ? 'Solution' : 'Question'}</button> */}
        </div>
        <div className="interaction-controls">
          <div style={{ marginTop: 'auto' }}>
            {/* <button id="undoButton" onClick={handleUndo}>Undo</button> */}
            <button onClick={handleReset} disabled={currentQuestion.graded}>Reset All</button>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={goToPreviousQuestion}>Previous Question</button>
            <button onClick={goToNextQuestion}>Next Question</button>
          </div>

          <label className='color-selection'>
            {colors.map((color, index) => (
              <label key={index}>
                <input type="radio" value={color} checked={highlightColor === color} onChange={(e) => setHighlightColor(e.target.value)} />
                <span
                  style={{ backgroundColor: color, display: 'inline-block', width: '20px', height: '20px' }}
                  className={highlightColor === color ? 'selected' : ''}
                ></span>
              </label>
            ))}
          </label>
        </div>
      </div>
    </div>
  );
}