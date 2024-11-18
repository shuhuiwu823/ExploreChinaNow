// AddPost.jsx
import React, { useState } from 'react';
import { addBlogPostToFirestore } from '../services/firestoreService'; // 引入新的 Firebase 方法
import '../template/AddPost.css';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 提交添加文章到 Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 设置加载状态，防止重复提交

    const newPost = { title, author, content, createdAt: new Date() }; // 包含创建时间

    try {
      await addBlogPostToFirestore(newPost); // 调用 Firestore 方法保存数据
      alert('文章已添加！');
      // 清空表单
      setTitle('');
      setAuthor('');
      setContent('');
    } catch (error) {
      alert("添加文章失败，请稍后再试");
      console.error("Error adding post: ", error);
    } finally {
      setLoading(false); // 重置加载状态
    }
  };

  return (
    <div className="add-post-container">
      <h2>添加新文章</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>标题:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>作者:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>内容:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "提交中..." : "提交文章"}
        </button>
      </form>
    </div>
  );
}
