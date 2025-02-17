import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Blog from './blog/Blog';
import ProtectedRoute from './auth/Protect'

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
              <Route path="/" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
