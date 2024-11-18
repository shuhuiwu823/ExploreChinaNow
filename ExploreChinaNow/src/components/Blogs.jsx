import React, { useState, useEffect } from 'react';
import '../template/Blogs.css';
import { getBlogPostsFromFirestore } from '../services/firestoreService'; // 使用 Firebase 获取数据
import AddPost from './AddPost';

export default function Blogs() {
  const [page, setPage] = useState('blogs'); // 初始页面状态为博客页面
  const [blogPosts, setBlogPosts] = useState([]); // 存储所有博客文章
  const [searchQuery, setSearchQuery] = useState(''); // 存储搜索关键词
  const [filteredPosts, setFilteredPosts] = useState([]); // 存储筛选后的文章

  // 从 Firestore 加载博客数据
  const fetchPosts = async () => {
    try {
      const posts = await getBlogPostsFromFirestore(); // 从 Firestore 获取数据
      setBlogPosts(posts);
      setFilteredPosts(posts);
    } catch (error) {
      console.error("加载博客文章失败: ", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 控制页面渲染
  const renderPage = () => {
    switch (page) {
      case 'blogs':
        return (
          <div>
            <div className="search-container">
              <input
                type="text"
                placeholder="按标题、作者或内容搜索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>搜索</button>
              <button onClick={handleClear}>清除</button>
            </div>
            <div className="blog-posts">
              {filteredPosts.length === 0 ? (
                <p>未找到匹配的博客文章。</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="blog-post">
                    <h3>{post.title}</h3>
                    <div className="post-author"><strong>作者：</strong> {post.author}</div>
                    <div className="post-content">{post.content}</div>
                    {post.images && post.images.length > 0 && (
                      <div className="image-grid">
                        {post.images.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`blog-${post.id}-${index}`}
                            className="image-thumbnail"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setPage('addPost')} className="add-post-button">
              添加文章
            </button>
          </div>
        );
      case 'addPost':
        return (
          <AddPost
            onPostAdded={() => {
              setPage('blogs'); // 返回博客页面
              fetchPosts(); // 刷新博客列表
            }}
          />
        );
      default:
        return null;
    }
  };

  // 处理清除搜索
  const handleClear = () => {
    setSearchQuery('');
    setFilteredPosts(blogPosts);
  };

  // 处理搜索
  const handleSearch = () => {
    const filtered = blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="blogs-container">
      <h2>博客文章</h2>
      {renderPage()}
    </div>
  );
}
