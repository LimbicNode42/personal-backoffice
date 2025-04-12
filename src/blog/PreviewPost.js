import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './PreviewPost.css';

function PreviewPost() {
    const { state } = useLocation();
    const post = state?.post;

  return (
    <div className="prose max-w-none centered-box">
        <div className='center-content'>
            <h1>{post?.title}</h1>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 center-content">
            {post?.tags.map((tag, index) => (
                <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                {tag}
                </span>
            ))}
        </div>

        <hr></hr>

        <div className='left-content'>
            <ReactMarkdown>{post?.text}</ReactMarkdown>
        </div>
    </div>
  );
}

export default PreviewPost;
