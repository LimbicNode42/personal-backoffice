import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleSubmit = async (publish, preview) => {
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

      if (preview == false) {
        onClose();
      } else {
        // console.log(data?.editPost);
        return data?.editPost;
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    const previewPost = await handleSubmit(false, true)

    sessionStorage.setItem("returnToModal", "true");
    sessionStorage.setItem("returnPost", JSON.stringify(previewPost));

    navigate('/blog-post-preview', { state: { post: previewPost, returnToModal: true } });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

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
      {/* Overlay */}
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

      {/* Content */}
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[90vw] bg-white p-5 rounded-lg shadow-lg z-50 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
          <Dialog.Title className="text-lg font-semibold">Edit Blog Post</Dialog.Title>
          <Dialog.Close className="cursor-pointer">
            <X size={24} onClick={onClose} />
          </Dialog.Close>
        </div>

        {/* Body */}
        <div className="mt-5 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              className="w-full h-[150px] border border-gray-300 p-2 rounded resize-y"
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
          <div className="flex flex-wrap gap-4">
            {images.filter(img => !img.markedForDelete).map((img, index) => (
              <div key={img.url} className="relative inline-block">
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  className="absolute top-1 left-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
                <img
                  src={img.url}
                  title={img.url}
                  alt={`Attachment ${index + 1}`}
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
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-300 pt-4 mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handlePreview()}
            disabled={loading}
          >
            Preview
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleSubmit(false, false)}
            disabled={loading}
          >
            Update
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleSubmit(true, false)}
            disabled={loading}
          >
            Publish
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default EditPostModal;
