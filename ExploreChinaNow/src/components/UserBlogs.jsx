import React, { useState, useEffect } from 'react';
import { getBlogPostsFromFirestore, updateBlogPostInFirestore, deleteBlogPostFromFirestore } from '../services/firestoreService';

function UserBlogs() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const author = '111';

  // 从 Firestore 加载指定作者的博客文章
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getUserBlogPostsFromFirestore(author);
        setFilteredPosts(posts);
      } catch (error) {
        console.error("加载博客文章失败: ", error);
      }
    };
    fetchPosts();
  }, []);

  // 处理保存编辑后的内容
  const handleSave = async () => {
    try {
      await updateBlogPostInFirestore(selectedPost.id, {
        title: selectedPost.title,
        content: selectedPost.content
      });
      const updatedPosts = filteredPosts.map(post =>
        post.id === selectedPost.id ? selectedPost : post
      );
      setFilteredPosts(updatedPosts);
      setSelectedPost(null); // 保存后返回博客列表
    } catch (error) {
      console.error("保存博客文章失败: ", error);
    }
  };

  // 处理删除选中的博客文章
  const handleDelete = async (postId) => {
    try {
      await deleteBlogPostFromFirestore(postId);
      const updatedPosts = filteredPosts.filter(post => post.id !== postId);
      setFilteredPosts(updatedPosts);
      setSelectedPost(null); // 删除后返回博客列表
    } catch (error) {
      console.error("删除博客文章失败: ", error);
    }
  };

  // 渲染选中博客的编辑表单
  const renderEditForm = () => (
    <div className="edit-post-container">
      <h2>编辑文章</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div>
          <label>标题:</label>
          <input
            type="text"
            value={selectedPost.title}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>内容:</label>
          <textarea
            value={selectedPost.content}
            onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
            required
          />
        </div>
        <button type="submit">保存</button>
        <button type="button" onClick={() => setSelectedPost(null)}>取消</button>
      </form>
    </div>
  );

  return (
    <div>
      <h2>Blogs by {author}</h2>
      <div className="blog-posts">
        {selectedPost ? (
          renderEditForm() // 显示编辑表单
        ) : (
          filteredPosts.length === 0 ? (
            <p>No blog posts found for {author}.</p>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="blog-post">
                <h3 onClick={() => setSelectedPost(post)}>{post.title}</h3>
                <p><strong>By:</strong> {post.author}</p>
                <p>{post.content}</p>
                <button onClick={() => setSelectedPost(post)}>编辑</button>
                <button onClick={() => handleDelete(post.id)}>删除</button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

export default UserBlogs;