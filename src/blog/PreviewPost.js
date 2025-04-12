import React from 'react';
import { useNavigate, useLocation, handleBack } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './PreviewPost.css';

function PreviewPost() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const post = state?.post;

    const handleBack = () => {
        navigate(-1);
      };

  return (
    <div className="prose max-w-none">
        <div>
            <h1>{post?.title}</h1>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
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

        <div>
            <ReactMarkdown>{post?.text}</ReactMarkdown>
        </div>
    </div>
  );
}

export default PreviewPost;
