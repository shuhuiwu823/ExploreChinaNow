import React, { useState } from 'react';
import { addBlogPostToFirestore } from '../services/firestoreService'; // 引入服务方法
import '../template/AddPost.css';

export default function AddPost({ onPostAdded }) { // 接收回调函数
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // 存储用户选择的图片文件

  // 处理图片选择
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 9) {
      alert("最多上传 9 张图片");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  // 提交添加文章到 Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 设置加载状态，防止重复提交

    const newPost = {
      title,
      author,
      content,
      createdAt: new Date(), // 包含创建时间
    };

    try {
      await addBlogPostToFirestore(newPost, images); // 调用 Firestore 方法保存数据
      alert('文章已添加！');
      // 清空表单
      setTitle('');
      setAuthor('');
      setContent('');
      setImages([]);
      if (onPostAdded) onPostAdded(); // 调用回调函数返回博客浏览页面
    } catch (error) {
      alert("添加文章失败，请稍后再试");
      console.error("添加文章时发生错误：", error);
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
        <div className="form-group">
          <label>上传图片 (最多 9 张):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                className="image-thumbnail"
              />
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "提交中..." : "提交文章"}
        </button>
      </form>
    </div>
  );
}
