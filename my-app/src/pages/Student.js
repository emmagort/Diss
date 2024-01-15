// Student.js
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Student(){
  // use the useLocation hook to get the location object
  const location = useLocation();
  // destructure the state data from the location object
  const { title } = location.state;
  const { content } = location.state;
  const { answer } = location.state;

  return (
      <div>
        <h1>The question is: {title}</h1>
        <h2>The content is: {content}</h2>
        <h3>The answer is: {answer}</h3>
      </div>
  );
}
























// // Student.js
// import React from 'react';
// import { useLocation } from 'react-router-dom';

// export default function Student(){
//   // use the useLocation hook to get the location object
//   const location = useLocation();
//   // destructure the state data from the location object
//   const { word } = location.state;
//   return (
//       <div>
//         <h1>The question is: {word ? word : "No question submitted yet"}</h1>
//       </div>
//   );
// }
