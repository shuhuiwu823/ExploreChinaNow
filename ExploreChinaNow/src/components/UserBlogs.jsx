import React, { useState, useEffect } from 'react';
import { getBlogPostsFromFirestore, updateBlogPostInFirestore, deleteBlogPostFromFirestore } from '../services/firestoreService';
import AddPost from './AddPost';
import '../template/Blogs.css';

function UserBlogs() {
  const [page, setPage] = useState('blogs'); // 页面状态: 'blogs', 'edit', 'addPost'
  const [blogPosts, setBlogPosts] = useState([]); // 所有博客文章
  const [filteredPosts, setFilteredPosts] = useState([]); // 筛选后的文章
  const [searchQuery, setSearchQuery] = useState(''); // 搜索关键词
  const [selectedPost, setSelectedPost] = useState(null); // 选中的文章
  const author = '111'; // 当前用户

  // 从 Firestore 加载特定用户的博客文章
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getBlogPostsFromFirestore();
        const userPosts = posts.filter((post) => post.author === author); // 仅筛选当前用户的文章
        setBlogPosts(userPosts);
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error("加载博客文章失败: ", error);
      }
    };
    fetchPosts();
  }, []);

  // 保存编辑后的文章
  const handleSave = async () => {
    try {
      await updateBlogPostInFirestore(selectedPost.id, {
        title: selectedPost.title,
        content: selectedPost.content,
      });
      const updatedPosts = blogPosts.map((post) =>
        post.id === selectedPost.id ? selectedPost : post
      );
      setBlogPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setSelectedPost(null);
      setPage('blogs');
    } catch (error) {
      console.error("保存博客文章失败: ", error);
    }
  };

  // 删除文章
  const handleDelete = async (postId) => {
    try {
      await deleteBlogPostFromFirestore(postId);
      const updatedPosts = blogPosts.filter((post) => post.id !== postId);
      setBlogPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setSelectedPost(null);
      setPage('blogs');
    } catch (error) {
      console.error("删除博客文章失败: ", error);
    }
  };

  // 搜索功能
  const handleSearch = () => {
    const filtered = blogPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredPosts(blogPosts);
  };

  // 渲染编辑表单
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
        <button type="button" onClick={() => setPage('blogs')}>取消</button>
      </form>
    </div>
  );

  // 页面渲染控制
  const renderPage = () => {
    switch (page) {
      case 'blogs':
        return (
          <div>
            <div className="search-container">
              <input
                type="text"
                placeholder="搜索标题或内容"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>搜索</button>
              <button onClick={handleClear}>清除</button>
            </div>
            <div className="blog-posts">
              {filteredPosts.length === 0 ? (
                <p>未找到匹配的文章。</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="blog-post">
                    <h3 onClick={() => { setSelectedPost(post); setPage('edit'); }}>{post.title}</h3>
                    <p><strong>作者:</strong> {post.author}</p>
                    <p>{post.content}</p>
                    <button onClick={() => { setSelectedPost(post); setPage('edit'); }}>编辑</button>
                    <button onClick={() => handleDelete(post.id)}>删除</button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setPage('addPost')} className="add-post-button">添加文章</button>
          </div>
        );
      case 'edit':
        return renderEditForm();
      case 'addPost':
        return (
          <AddPost
            onPostAdded={() => {
              setPage('blogs');
              setFilteredPosts(blogPosts);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-blogs-container">
      <h2>{author} 的博客文章</h2>
      {renderPage()}
    </div>
  );
}

export default UserBlogs;
