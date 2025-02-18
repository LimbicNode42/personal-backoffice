import './EditPost.css'
import React, {useState, useEffect} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { gql, useMutation } from "@apollo/client";

const EDIT_POST = gql`
mutation EditPost($input: EditPost!) {
  editPost(input: $input) {
      id
      published
      title
      text
      attachments
      tags
  }
}
`;

const DELETE_POST = gql`
mutation DeletePost($input: DeletePost!) {
  deletePost(input: $input) {
      id
      published
      title
      text
      attachments
      tags
  }
}
`;

function EditPostModal({ post, token, refetch, onClose }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.text);
  const [published, setPublished] = useState(post.published);
  const availableTags = ["Coding", "System_Architecture", "Book"];
  const [selectedTags, setSelectedTags] = useState(post.tags);
  const [images, setImages] = useState(post.attachments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editPost] = useMutation(EDIT_POST);
  const [deletePost] = useMutation(DELETE_POST);

  useEffect(() => {
    if (post) {
      setTitle(post.title || ""); // Ensure it doesn't break on undefined
      setContent(post.text || "");
      setPublished(post.published || false);
      setSelectedTags(post.tags || []);
      setImages(post.attachments || []);
    }
  }, [post]); // Runs whenever `post` changes

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
      const { data } = await editPost({
        variables: {
          input: {
            id: post.id,
            published,
            title,
            text: content,
            tags: selectedTags,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      console.log("Post updated successfully:", data);

      if (refetch) refetch();

      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await deletePost({
        variables: {
          input: {
            id: post.id,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      console.log("Post deleted successfully:", data);

      if (refetch) refetch();

      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={!!post} onOpenChange={onClose}>
      <Dialog.Overlay className="radix-overlay" />
      <Dialog.Content className="radix-content">
        {/* Modal Header */}
        <div className="modal-header">
          <Dialog.Title className="text-lg font-semibold">View Blog Post</Dialog.Title>
          <Dialog.Close className="cursor-pointer">
            <X size={24} onClick={onClose} />
          </Dialog.Close>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Blog Post Title */}
          <label className="block text-sm font-medium">Title</label>
          <input 
            type="text" 
            className="border p-2 w-full rounded" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Blog Post Content */}
          <label className="block text-sm font-medium">Content</label>
          <textarea 
            className="blog-textarea" 
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

          {/* Attachments */}
          {images && images.length > 0 && (
            <>
              <label className="block text-sm font-medium">Attachments</label>
              <ul className="list-disc pl-5">
                {images.map((file, index) => (
                  <li key={index}>
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleDelete}
              disabled={loading}>
            Delete
          </button>
        </div>
        <div className="modal-footer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={loading}>
            Update
          </button>
        </div>
        <div className="modal-footer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditPostModal;
