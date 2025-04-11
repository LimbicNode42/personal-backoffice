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
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    };
    
    const removeImage = (url) => {
      setImages((prevImages) => prevImages.filter((img) => img.url !== url));
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
              attachments: images.map((img) => img.file),
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
              <div>
                <label className="block text-sm font-medium">Title: </label>
                <input 
                  type="text" 
                  className="border p-2 w-full rounded" 
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br></br>
  
              {/* Blog Post Content */}
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea 
                  className="blog-textarea" 
                  placeholder="Write your blog post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <br></br>
  
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium">Attach Images: </label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="border p-2 w-full rounded"
                  onChange={handleImageUpload}
                />
              </div>
              <br></br>
  
              {/* Image Previews */}
              <div className="image-preview-container">
                {images.map((img, index) => (
                  <div key={img.url} className="image-wrapper">
                    <button 
                      className="remove-button" 
                      onClick={() => removeImage(img.url)}
                    >
                      ❌
                    </button>
                    <img src={img.url} alt={`upload-${index}`} className="image-preview" />
                  </div>
                ))}
              </div>

              {/* Multi-Select Dropdown for Tags */}
              <div>
                <label className="block text-sm font-medium">Tags</label><br></br>
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
              </div>
            </form>
          </div>
  
          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded inline-buttons"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    );
  }

export default CreatePostModal;