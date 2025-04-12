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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 p-5">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-lg shadow-md bg-white transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
            <span
              className={`font-bold mt-2 block ${
                post.published ? "text-green-600" : "text-red-600"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
        ))}

        {selectedPost && (
          <EditPostModal
            post={selectedPost}
            token={token}
            loading={loading}
            error={error}
            data={data}
            refetch={refetch}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </div>
    );
  };

export default BlogList;