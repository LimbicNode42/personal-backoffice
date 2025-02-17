import './ShowPosts.css';
import React from 'react';
import { useEffect } from "react";

const BlogList = ({token, loading, error, data, refetch}) => {
    // Refetch data when the token is set
    useEffect(() => {
      if (token) {
        refetch();
      }
    }, [token, refetch]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div className="blog-container">
        {data.posts.map((post) => (
          <div key={post.id} className="blog-card">
            <h3 className="blog-title">{post.title}</h3>
            <span className={post.published ? "status published" : "status draft"}>
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
        ))}
      </div>
    );
  };

export default BlogList;