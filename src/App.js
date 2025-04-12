import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, BrowserRouter } from 'react-router-dom';
import Blog from './blog/Blog';
import ProtectedRoute from './auth/Protect'
import PreviewPost from './blog/PreviewPost';
import Datasets from './datasets/Datasets';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-beige font-sans">
        <nav className="w-full py-[5vh]">
          <ul className="flex justify-center items-center list-none p-0 m-0">
            <li className="mx-5">
              <Link to="/" 
                onClick={() => {
                  sessionStorage.removeItem("returnToModal");
                  sessionStorage.removeItem("returnPost");
                }}
                className="text-gray-900 text-lg px-4 py-1 rounded hover:bg-gray-200 no-underline">
                Blog
              </Link>
              <Link to="/datasets" 
                className="text-gray-900 text-lg px-4 py-1 rounded hover:bg-gray-200 no-underline">
                Datasets
              </Link>
            </li>
          </ul>
        </nav>

        <main className="flex justify-center items-start p-4">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            <Route path="/blog-post-preview" element={<ProtectedRoute><PreviewPost /></ProtectedRoute>} />
            <Route path="/datasets" element={<ProtectedRoute><Datasets /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
