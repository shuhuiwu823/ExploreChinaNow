import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 初始加载状态设为 true
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const auth = getAuth();
    // 监听用户登录状态
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 用户已登录，提取所需信息
        setUserData({
          username: user.displayName || "Anonymous",
          email: user.email,
          avatar: user.photoURL || "/default-avatar.png",
          name: user.displayName || "Anonymous",
        });
      } else {
        // 用户未登录
        setUserData(null);
      }
      setLoading(false); // 加载完成
    });

    // 清除监听器
    return () => unsubscribe();
  }, []);

  const value = {
    userData, 
    setUserData, 
    loading,
    setLoading,
    errorMsg,
    setErrorMsg
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
