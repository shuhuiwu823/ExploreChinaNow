import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context";
import { getBlogPostsFromFirestore, deleteBlogPostFromFirestore } from "../services/firestoreService";
import "./Profile.css";

function Profile() {
  const { userData, loading: userLoading } = useContext(AppContext);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [expandedBlogs, setExpandedBlogs] = useState({}); // Stores the expanded state of each blog

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!userData || !userData.username) {
        setLoadingBlogs(false);
        return;
      }

      try {
        const allPosts = await getBlogPostsFromFirestore();
        const filteredPosts = allPosts.filter((post) => post.author === userData.username);
        setUserBlogs(filteredPosts);
      } catch (error) {
        console.error("Failed to load user blogs: ", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchUserBlogs();
  }, [userData]);

  const handleDelete = async (blogId) => {
    const confirmation = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmation) return;

    try {
      await deleteBlogPostFromFirestore(blogId);
      setUserBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Failed to delete blog: ", error);
    }
  };

  const isValidFirebaseUrl = (url) => {
    return url && url.includes("firebasestorage.googleapis.com");
  };

  const handleToggleExpanded = (blogId) => {
    setExpandedBlogs((prevExpanded) => ({
      ...prevExpanded,
      [blogId]: !prevExpanded[blogId], // Toggle the expanded state for this blog
    }));
  };

  if (userLoading) {
    return <p>Loading user information...</p>;
  }

  if (!userData) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="profile-container">
  <div className="blogs-section">
    <h3>My Blog Posts</h3>
    {loadingBlogs ? (
      <p>Loading blog posts...</p>
    ) : userBlogs.length > 0 ? (
      userBlogs.map((blog) => (
        <div key={blog.id} className="blog-post">
          {blog.images && blog.images.length > 0 && isValidFirebaseUrl(blog.images[0]) ? (
            <img src={blog.images[0]} alt="Blog cover" className="blog-image" />
          ) : (
            <div className="no-image">No image</div>
          )}
          <h4>{blog.title}</h4>
          <p>
            {expandedBlogs[blog.id] ? blog.content : `${blog.content.slice(0, 100)}...`}
            <span
              className="toggle-link"
              onClick={() => handleToggleExpanded(blog.id)}
            >
              {expandedBlogs[blog.id] ? "Collapse" : "Expand"}
            </span>
          </p>
          <button
            className="blog-delete-btn"
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
