import "./CreatePost.css"
import React from 'react';
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { gql, useMutation } from "@apollo/client";

const CREATE_POST = gql`
mutation CreatePost($input: NewPost!) {
  createPost(input: $input) {
      id
      published
      title
      text
      tags
      attachments
  }
}
`;

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
      setImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
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
              tags: selectedTags,
              attachments: images.map((file) => file),
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
                {images.map((img) => (
                  <img 
                    key={img} 
                    src={URL.createObjectURL(img)} 
                    alt={`upload-${img}`} 
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

export default CreatePostModal;