import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import InputFolder from './routes/InputFolder';
import Reader from './routes/Reader';

const frameworkVersion = '2.0';

function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  console.log('Created with SQ Framework Version:', frameworkVersion);
  return (
    <Routes>
      <Route path="/" element={<InputFolder />} />
      <Route path="/reader" element={<Reader />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
