// src/components/Blog.js
import './Blog.css';
import React from 'react';
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../auth/Login";

const CREATE_POST = gql`
mutation CreatePost($input: NewPost!) {
  createPost(input: $input) {
      id
      published
      title
      text
      attachments
      tags
  }
}
`;

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

function CreatePostModal({ token, open, onOpenChange, refetch }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const availableTags = ["Coding", "System_Architecture", "Book"];
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createPost] = useMutation(CREATE_POST);

  const handleTagSelection = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTags(selectedValues);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await createPost({
        variables: {
          input: {
            title,
            text: content,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      console.log("Post submitted successfully:", data);

      if (refetch) refetch();

      onOpenChange(false);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="radix-overlay" />
      <Dialog.Content className="radix-content">
        {/* Modal Header */}
        <div className="modal-header">
          <Dialog.Title className="text-lg font-semibold">Create Blog Post</Dialog.Title>
          <Dialog.Close className="cursor-pointer">
            <X size={24} />
          </Dialog.Close>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form className="space-y-4">
            {/* Blog Post Title */}
            <label className="block text-sm font-medium">Title</label>
            <input 
              type="text" 
              className="border p-2 w-full rounded" 
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Blog Post Content */}
            <label className="block text-sm font-medium">Content</label>
            <textarea 
              className="blog-textarea" 
              placeholder="Write your blog post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Multi-Select Dropdown for Tags */}
            <label className="block text-sm font-medium">Tags</label>
            <select 
              multiple 
              className="border p-2 w-full rounded"
              value={selectedTags}
              onChange={handleTagSelection}
            >
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Image Upload */}
            <label className="block text-sm font-medium">Attach Images</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="border p-2 w-full rounded"
              onChange={handleImageUpload}
            />

            {/* Image Previews */}
            <div className="image-preview-container">
              {images.map((img, index) => (
                <img 
                  key={index} 
                  src={URL.createObjectURL(img)} 
                  alt={`upload-${index}`} 
                  className="image-preview"
                />
              ))}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit Post
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

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
          <p className="blog-summary">{post.text.substring(0, 100)}...</p>
          <span className={post.published ? "status published" : "status draft"}>
            {post.published ? "Published" : "Draft"}
          </span>
        </div>
      ))}
    </div>
  );
};
