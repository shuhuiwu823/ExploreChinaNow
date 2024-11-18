import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context"; // Import Context
import { addBlogPostToFirestore } from "../services/firestoreService";
import "../template/AddPost.css";

export default function AddPost({ onPostAdded }) {
  const { userData } = useContext(AppContext); // Get user data from Context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Store user-selected image files
  const maxContentLength = 1000; // Set a maximum content length
  const navigate = useNavigate();

  // Submit and add the post to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.length > maxContentLength) {
      alert(`Content length cannot exceed ${maxContentLength} characters`);
      return;
    }

    setLoading(true); // Set loading state to prevent duplicate submissions

    const newPost = {
      title,
      author: userData?.username || "Anonymous", // Get username from Context
      content,
      createdAt: new Date(), // Include creation time
    };

    try {
      await addBlogPostToFirestore(newPost, images); // Call Firestore method to save data
      alert("Post successfully added!");
      // Clear the form
      setTitle("");
      setContent("");
      setImages([]);
      if (onPostAdded) {
        onPostAdded(); // If a callback is provided, call it to refresh the parent component
      } else {
        navigate("/blogs"); // Navigate to /blogs if no callback is provided
      }
    } catch (error) {
      alert("Failed to add the post, please try again later");
      console.error("Error occurred while adding the post:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 9) {
      alert("You can upload up to 9 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  // Remove a selected image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="add-post-container">
      <h2>Add New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            value={userData?.username || "Anonymous"} // Get username from Context
            readOnly // Set to read-only
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={maxContentLength} // Limit maximum characters
            required
          />
          <div className="char-counter">
            {content.length}/{maxContentLength} characters
          </div>
        </div>
        <div className="form-group">
          <label>Upload Images (up to 9):</label>
          <input
            type="file"
            accept="image/*"
            multiplehandleSubmit
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {images.map((image, index) => (
              <div key={index} className="image-preview-item">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="image-thumbnail"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
