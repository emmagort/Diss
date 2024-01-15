
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Student(){
  const location = useLocation();
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