import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context";
import { getBlogPostsFromFirestore } from "../services/firestoreService";
import "./Profile.css";

function Profile() {
  const { userData, loading: userLoading } = useContext(AppContext);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

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
        console.error("加载用户博客失败: ", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchUserBlogs();
  }, [userData]);

  if (userLoading) {
    return <p>正在加载用户信息...</p>;
  }

  if (!userData) {
    return <p>您尚未登录。</p>;
  }

  return (
    <div className="profile-container">
      <div className="blogs-section">
        <h3>我的博客文章</h3>
        {loadingBlogs ? (
          <p>正在加载博客文章...</p>
        ) : userBlogs.length > 0 ? (
          userBlogs.map((blog) => (
            <div key={blog.id} className="blog-post">
              <h4>{blog.title}</h4>
              <p>{blog.content}</p>
            </div>
          ))
        ) : (
          <p>您尚未发表任何博客文章。</p>
        )}
      </div>
      <div className="profile-block">
        <img className="profile-avatar" src={userData.avatar} alt={userData.username} />
        <div className="profile-username" data-label="Username:">{userData.username}</div>
        <div className="profile-email" data-label="E-mail:">{userData.email}</div>
        <div className="profile-name" data-label="Name:">{userData.name}</div>
      </div>
    </div>
  );
}

export default Profile;
