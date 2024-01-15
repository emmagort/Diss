import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Student(){
  const location = useLocation();
  const { title } = location.state;
  const { content } = location.state;
  const { answer } = location.state;
  const [highlightColor, setHighlightColor] = useState('yellow');

  function handleHighlight() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let mark = document.createElement('mark');
    mark.style.backgroundColor = highlightColor;
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
  }

  return (
    <div>
      <h1>The question is: {title}</h1>
      <h2 contentEditable={true} onMouseUp={handleHighlight}>The content is: {content}</h2>
      <h3>The answer is: {answer}</h3>
      <label>
        Select highlight color:
        <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} />
      </label>
    </div>
  );
}


// import React from 'react';
// import { useLocation } from 'react-router-dom';

// export default function Student(){
//   const location = useLocation();
//   const { title } = location.state;
//   const { content } = location.state;
//   const { answer } = location.state;

//   return (
//       <div>
//         <h1>The question is: {title}</h1>
//         <h2>The content is: {content}</h2>
//         <h3>The answer is: {answer}</h3>
//       </div>
//   );
// }