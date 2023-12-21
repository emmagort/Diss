import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Student from './pages/Student';
import NoPage from './pages/NoPage';
import Index from './pages/Index';
import Teacher from './pages/Teacher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Index />} />
          <Route path="home" element={<Home />} />
          <Route path="student" element={<Student />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);