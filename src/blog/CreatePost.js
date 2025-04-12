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
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

        {/* Modal Content */}
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] h-[80%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-2">
            <Dialog.Title className="text-lg font-semibold">Create Blog Post</Dialog.Title>
            <Dialog.Close className="cursor-pointer">
              <X size={24} />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-2">
            <form className="space-y-4">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  className="border p-2 w-full rounded"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea 
                  className="w-full h-[200px] p-2 border border-gray-300 rounded resize-y"
                  placeholder="Write your blog post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium">Attach Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="border p-2 w-full rounded"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Image Previews */}
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((img, index) => (
                  <div key={img.url} className="relative inline-block">
                    <button 
                      className="absolute top-1 left-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => removeImage(img.url)}
                      type="button"
                    >
                      ×
                    </button>
                    <img 
                      src={img.url} 
                      alt={`upload-${index}`} 
                      className="w-[100px] h-[100px] object-cover border border-gray-300 rounded" 
                    />
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
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
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-gray-300 pt-2">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
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