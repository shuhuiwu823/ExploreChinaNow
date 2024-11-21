import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context";
import {
  getBlogPostsFromFirestore,
  deleteBlogPostFromFirestore,
} from "../services/firestoreService";
import "./Profile.css";

/**
 * Profile component that displays the user's information and their blog posts.
 * Users can view, expand, and delete their blog posts.
 *
 * @component
 * @returns {JSX.Element} The rendered Profile component.
 */
function Profile() {
  const { userData, loading: userLoading } = useContext(AppContext);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [expandedBlogs, setExpandedBlogs] = useState({});

  /**
   * Fetches the user's blog posts from Firestore.
   * Filters posts based on the logged-in user's username.
   *
   * @function fetchUserBlogs
   * @async
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!userData || !userData.username) {
        setLoadingBlogs(false);
        return;
      }

      try {
        const allPosts = await getBlogPostsFromFirestore();
        const filteredPosts = allPosts.filter(
          (post) => post.author === userData.username
        );
        setUserBlogs(filteredPosts);
      } catch (error) {
        console.error("Failed to load user blogs: ", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchUserBlogs();
  }, [userData]);

  /**
   * Deletes a blog post by ID.
   * Confirms with the user before deletion and removes the blog from the UI.
   *
   * @function handleDelete
   * @async
   * @param {string} blogId - The ID of the blog to delete.
   * @returns {Promise<void>}
   */
  const handleDelete = async (blogId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmation) return;

    try {
      await deleteBlogPostFromFirestore(blogId);
      setUserBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== blogId)
      );
    } catch (error) {
      console.error("Failed to delete blog: ", error);
    }
  };

  /**
   * Validates whether a given URL is a valid Firebase Storage URL.
   *
   * @function isValidFirebaseUrl
   * @param {string} url - The URL to validate.
   * @returns {boolean} True if the URL is a valid Firebase Storage URL, otherwise false.
   */
  const isValidFirebaseUrl = (url) => {
    return url && url.includes("firebasestorage.googleapis.com");
  };

  /**
   * Toggles the expanded state of a blog post to show full content or a snippet.
   *
   * @function handleToggleExpanded
   * @param {string} blogId - The ID of the blog to toggle.
   */
  const handleToggleExpanded = (blogId) => {
    setExpandedBlogs((prevExpanded) => ({
      ...prevExpanded,
      [blogId]: !prevExpanded[blogId],
    }));
  };

  // Renders user information and their blog posts
  if (userLoading) {
    return <p>Loading user information...</p>;
  }

  if (!userData) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-blogs-section">
        <h3>My Blog Posts</h3>
        {loadingBlogs ? (
          <p>Loading blog posts...</p>
        ) : userBlogs.length > 0 ? (
          userBlogs.map((blog) => (
            <div key={blog.id} className="profile-blog-post">
              {blog.images &&
              blog.images.length > 0 &&
              isValidFirebaseUrl(blog.images[0]) ? (
                <img
                  src={blog.images[0]}
                  alt="Blog cover"
                  className="profile-blog-image"
                />
              ) : (
                ''
              )}
              <h4>{blog.title}</h4>
              <p>
                {expandedBlogs[blog.id]
                  ? blog.content
                  : `${blog.content.slice(0, 100)}...`}
                <span
                  className="profile-toggle-link"
                  onClick={() => handleToggleExpanded(blog.id)}
                >
                  {expandedBlogs[blog.id] ? "Collapse" : "Expand"}
                </span>
              </p>
              <button
                className="profile-blog-delete-btn"
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>You have not published any blog posts yet.</p>
        )}
      </div>

      <div className="context-container">
        <img
          className="context-avatar"
          src={userData.avatar}
          alt={userData.username}
        />
        <div className="context-info" data-label="Username:">
          {userData.username}
        </div>
        <div className="context-info" data-label="E-mail:">
          {userData.email}
        </div>
        <div className="context-info" data-label="Name:">
          {userData.name}
        </div>
      </div>
    </div>
  );
}

export default Profile;
