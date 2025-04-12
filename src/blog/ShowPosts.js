import './ShowPosts.css';
import EditPostModal from './EditPost';
import React, {useState, useEffect} from 'react';

const BlogList = ({token, loading, error, data, refetch}) => {
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
      const shouldReturn = sessionStorage.getItem("returnToModal");
      const postData = sessionStorage.getItem("returnPost");
    
      if (shouldReturn && postData) {
        const parsedPost = JSON.parse(postData);
        setSelectedPost(parsedPost);
    
        // Clean up so modal doesn't reopen on future visits
        sessionStorage.removeItem("returnToModal");
        sessionStorage.removeItem("returnPost");
      }
    }, []);

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
          <div key={post.id} className="blog-card cursor-pointer" onClick={() => setSelectedPost(post)}>
            <h3 className="blog-title">{post.title}</h3>
            <span className={post.published ? "status published" : "status draft"}>
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
        ))}

        {/* ✅ Open modal when a post is clicked */}
        {selectedPost && (
            <EditPostModal post={selectedPost} token={token} loading={loading}
              error={error} data={data} refetch={refetch} onClose={() => setSelectedPost(null)} />
        )}
      </div>
    );
  };

export default BlogList;