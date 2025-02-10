import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Blog from './components/Blog';

function App() {
  return (
    <Router>
      <div>
        {/* Static Toolbar */}
        <nav>
          <ul>
            <li><Link to="/">Blog</Link></li>
          </ul>
        </nav>

        {/* <hr></hr> */}

        {/* Main content */}
        <div>
          <Routes>
            <Route path="/" element={<Blog />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
