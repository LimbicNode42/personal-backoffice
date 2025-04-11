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
      tags
      attachments
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
      tags
      attachments
  }
}
`;

function EditPostModal({ post, token, refetch, onClose }) {
  const cdnBaseUrl = 'https://cdn.wheeler-network.com/';
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.text);
  const [published, setPublished] = useState(post.published);
  const availableTags = ["Coding", "System_Architecture", "Book"];
  const [selectedTags, setSelectedTags] = useState(post.tags);
  const [images, setImages] = useState([]);
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

      const existingImages = (post.attachments || []).map((path) => ({
        url: `${cdnBaseUrl}${path}`,
        originalPath: `${path}`,
        isNew: false, // Mark existing images
      }));
  
      setImages(existingImages);
    }
  }, [post]); // Runs whenever `post` changes

  const handleTagSelection = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTags(selectedValues);
  };

  const handleImageUpload = (e) => {
    const newImages = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true, // Mark new uploads
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  
  const removeImage = (url) => {
    setImages((prevImages) => 
      prevImages.map((img) => {
        if (img.url === url) {
          if (img.isNew) {
            return null; // Remove new images from state
          } else {
            // Mark existing image for deletion
            return { ...img, markedForDelete: true };
          }
        }
        return img;
      }).filter(Boolean) // Filter out `null` values for new images
    );
  };

  const handleSubmit = async (publish) => {
    setLoading(true);
    setError(null);

    const existingImagePaths = images
      .filter((img) => !img.isNew && !img.markedForDelete)
      .map((img) => img.originalPath);

    const deletedImagePaths = images
      .filter((img) => !img.isNew && img.markedForDelete)
      .map((img) => img.originalPath);

    const newImages = images
      .filter((img) => img.isNew)
      .map((img) => img.file);

    if (publish) {
      setPublished(publish);
    }

    try {
      const { data } = await editPost({
        variables: {
          input: {
            id: post.id,
            published,
            title,
            text: content,
            tags: selectedTags,
            unchangedAttachments: existingImagePaths,
            newAttachments: newImages,
            deletedAttachments: deletedImagePaths
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
            title: post.title,
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
          <Dialog.Title className="text-lg font-semibold">Edit Blog Post</Dialog.Title>
          <Dialog.Close className="cursor-pointer">
            <X size={24} onClick={onClose} />
          </Dialog.Close>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Blog Post Title */}
          <div>
            <label className="block text-sm font-medium">Title: </label>
            <input 
              type="text" 
              className="border p-2 w-full rounded" 
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
            {images.filter((img) => !img.markedForDelete).map((img, index) => (
              <div key={img.url} className="image-wrapper">
                <button 
                  className="remove-button" 
                  onClick={() => removeImage(img.url)}
                >
                  ❌
                </button>
                <img
                  src={img.url}
                  title={img.url}
                  alt={`Attachment ${index + 1}`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
          <br></br>

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
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded inline-buttons"
              onClick={handleDelete}
              disabled={loading}>
            Delete
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded inline-buttons"
              onClick={() => handleSubmit(false)}
              disabled={loading}>
            Update
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded inline-buttons" 
              onClick={() => handleSubmit(true)}
              disabled={loading}>
            Publish
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded inline-buttons" 
              onClick={onClose}>
            Close
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditPostModal;
