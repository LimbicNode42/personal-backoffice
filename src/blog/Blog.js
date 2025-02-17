// src/components/Blog.js
import './Blog.css';
import CreatePostModal from './CreatePost';
import BlogList from './ShowPosts';
import React from 'react';
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "../auth/Login";

const GET_POSTS = gql`
query Posts {
  posts {
    id
    published
    title
    text
  }
}
`;

function Blog() {
  // Flags to detect whether createPost modal is open
  const [isOpen, setIsOpen] = useState(false);

  const { token } = useAuth(); // Get token from context
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  return (
    <div className='Blog'>
      <header className="Blog-header">
        <h2>Blog</h2>

        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>

        <BlogList token={token} loading={loading} error={error} data={data} refetch={refetch} />

        <CreatePostModal token={token} open={isOpen} onOpenChange={setIsOpen} refetch={refetch} />
      </header>
    </div>
  );
}
export default Blog;




