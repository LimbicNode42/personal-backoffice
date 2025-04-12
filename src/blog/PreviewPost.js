import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function PreviewPost() {
    const { state } = useLocation();
    const post = state?.post;

  return (
    <div className="prose max-w-none w-[50vw] mx-auto flex flex-col items-center">
        {/* Centered title */}
        <div className="text-center px-4 w-full">
            <h1>{post?.title}</h1>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2 justify-center px-4 w-full">
            {post?.tags.map((tag, index) => (
            <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
                {tag}
            </span>
            ))}
        </div>

        {/* Divider */}
        <hr className="w-full border-t border-gray-300 my-4" />

        {/* Markdown content */}
        <div className="text-left px-4 w-full break-words">
            <ReactMarkdown>{post?.text}</ReactMarkdown>
        </div>
    </div>
  );
}

export default PreviewPost;
