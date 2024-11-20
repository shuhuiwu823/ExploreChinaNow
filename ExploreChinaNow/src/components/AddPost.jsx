import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context";
import { addBlogPostToFirestore } from "../services/firestoreService";
import "../template/AddPost.css";

export default function AddPost({ onPostAdded }) {
  const { userData } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const maxContentLength = 1000;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const author = userData?.username || "Anonymous"; // 定义作者

    const newPost = {
      title,
      author,
      content,
      createdAt: new Date(),
    };

    try {
      await addBlogPostToFirestore(newPost, images);
      alert("Post successfully added!");
      setTitle("");
      setContent("");
      setImages([]);
      if (onPostAdded) onPostAdded();
      navigate("/blogs", { replace: true });
    } catch (error) {
      console.error("Error occurred while adding the post:", error);
      alert("Failed to add the post, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 9) {
      alert("You can upload up to 9 images");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

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
          <input type="text" value={userData?.username || "Anonymous"} readOnly />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={maxContentLength}
            required
          />
          <div className="char-counter">
            {content.length}/{maxContentLength} characters
          </div>
        </div>
        <div className="form-group">
          <label>Upload Images (up to 9):</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
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
