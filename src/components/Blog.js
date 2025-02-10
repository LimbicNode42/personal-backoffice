// src/components/Blog.js
import './Blog.css';
import React from 'react';
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

function Blog() {
  const [isOpen, setIsOpen] = useState(false);

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

        <CreatePostModal open={isOpen} onOpenChange={setIsOpen} />
      </header>
    </div>
  );
}
export default Blog;

function CreatePostModal({ open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <Dialog.Title className="text-lg font-semibold">Create Post</Dialog.Title>
        <Dialog.Close className="absolute top-2 right-2">
          <X size={20} />
        </Dialog.Close>
        
        <form className="mt-4">
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="border p-2 w-full rounded" placeholder="Enter your name" />
          
          <label className="block text-sm font-medium mt-3">Email</label>
          <input type="email" className="border p-2 w-full rounded" placeholder="Enter your email" />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit</button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}