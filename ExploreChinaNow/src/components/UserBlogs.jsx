import React, { useState, useEffect } from 'react';
import { getBlogPostsFromFirestore, updateBlogPostInFirestore, deleteBlogPostFromFirestore } from '../services/firestoreService';
import AddPost from './AddPost';
import '../template/Blogs.css';

function UserBlogs() {
  const [page, setPage] = useState('blogs'); // Page state: 'blogs', 'edit', 'addPost'
  const [blogPosts, setBlogPosts] = useState([]); // All blog posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered posts
  const [searchQuery, setSearchQuery] = useState(''); // Search keyword
  const [selectedPost, setSelectedPost] = useState(null); // Selected post
  const author = '111'; // Current user

  // Load blog posts for the specific user from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getBlogPostsFromFirestore();
        const userPosts = posts.filter((post) => post.author === author); // Filter posts by the current user
        setBlogPosts(userPosts);
        setFilteredPosts(userPosts);
      } catch (error) {
        console.error("Failed to load blog posts: ", error);
      }
    };
    fetchPosts();
  }, []);

  // Save the edited post
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
      console.error("Failed to save blog post: ", error);
    }
  };

  // Delete a post
  const handleDelete = async (postId) => {
    try {
      await deleteBlogPostFromFirestore(postId);
      const updatedPosts = blogPosts.filter((post) => post.id !== postId);
      setBlogPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setSelectedPost(null);
      setPage('blogs');
    } catch (error) {
      console.error("Failed to delete blog post: ", error);
    }
  };

  // Search functionality
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

  // Render the edit form
  const renderEditForm = () => (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={selectedPost.title}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={selectedPost.content}
            onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => setPage('blogs')}>Cancel</button>
      </form>
    </div>
  );

  // Page rendering control
  const renderPage = () => {
    switch (page) {
      case 'blogs':
        return (
          <div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by title or content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleClear}>Clear</button>
            </div>
            <div className="blog-posts">
              {filteredPosts.length === 0 ? (
                <p>No matching posts found.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="blog-post">
                    <h3 onClick={() => { setSelectedPost(post); setPage('edit'); }}>{post.title}</h3>
                    <p><strong>Author:</strong> {post.author}</p>
                    <p>{post.content}</p>
                    <button onClick={() => { setSelectedPost(post); setPage('edit'); }}>Edit</button>
                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setPage('addPost')} className="add-post-button">Add Post</button>
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
      <h2>Blog Posts by {author}</h2>
      {renderPage()}
    </div>
  );
}

export default UserBlogs;
