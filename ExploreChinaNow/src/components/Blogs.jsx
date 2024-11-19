import React, { useState, useEffect, useContext } from "react";
import "../template/Blogs.css";
import { getBlogPostsFromFirestore } from "../services/firestoreService";
import AddPost from "./AddPost";
import { AppContext } from "../Context";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
  const [page, setPage] = useState("blogs");
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getBlogPostsFromFirestore();
        setBlogPosts(posts);
        setFilteredPosts(posts);
        const initialExpanded = posts.reduce((acc, post) => {
          acc[post.id] = false;
          return acc;
        }, {});
        setExpanded(initialExpanded);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = () => {
    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredPosts(blogPosts);
    setCurrentPage(1);
  };

  const paginatePosts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  };

  const renderPage = () => {
    if (page === "addPost") {
      return (
        <AddPost
          onPostAdded={() => {
            setPage("blogs");
            fetchPosts();
          }}
        />
      );
    }

    return (
      <div>
        <div className="search-and-add-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title, author, or content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleClear}>Clear</button>
          </div>
          <button
            onClick={() => {
              if (userData) {
                setPage("addPost");
              } else {
                navigate("/sign-in");
              }
            }}
            className="add-post-button"
          >
            Add Post
          </button>
        </div>

        <div className="blog-posts">
          {paginatePosts().map((post) => (
            <article key={post.id} className={`blog-post ${expanded[post.id] ? "expanded" : ""}`}>
              <header className="blog-post-header">
                <h3>{post.title}</h3>
                <p className="post-author">
                  <span>Author:</span> {post.author}
                </p>
              </header>
              <div className="blog-post-content">
                <p>
                  {expanded[post.id]
                    ? post.content
                    : `${post.content.slice(0, 200)}...`}
                </p>
                <button
                  className="toggle-link"
                  onClick={() => toggleExpand(post.id)}
                >
                  {expanded[post.id] ? "Collapse" : "Expand"}
                </button>
              </div>
              {post.images?.length > 0 && (
                <div className="image-container">
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
            </article>
          ))}
          {filteredPosts.length === 0 && (
            <p className="no-results">No matching blog posts found.</p>
          )}
        </div>

        <nav className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(filteredPosts.length / pageSize) },
            (_, index) => (
              <button
                key={index + 1}
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            disabled={currentPage === Math.ceil(filteredPosts.length / pageSize)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <section className="blogs-container">
      <h2>Blog Posts</h2>
      {renderPage()}
    </section>
  );
}
