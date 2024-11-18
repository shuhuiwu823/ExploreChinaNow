import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// 从 Firestore 获取博客文章数据
export async function getBlogPostsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("获取博客文章失败: ", error);
    throw error;
  }
}

export async function getUserBlogPostsFromFirestore(authorName) {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogPosts'));
      // 过滤出指定作者的博客文章
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.author === authorName);
    } catch (error) {
      console.error("获取博客文章失败: ", error);
      throw error;
    }
  }
  
  // 更新博客文章
  export async function updateBlogPostInFirestore(postId, updatedData) {
    try {
      const postRef = doc(db, 'blogPosts', postId);
      await updateDoc(postRef, updatedData);
    } catch (error) {
      console.error("更新博客文章失败: ", error);
      throw error;
    }
  }
  
  // 删除博客文章
  export async function deleteBlogPostFromFirestore(postId) {
    try {
      const postRef = doc(db, 'blogPosts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error("删除博客文章失败: ", error);
      throw error;
    }
  }

  // 添加博客文章到 Firestore
export async function addBlogPostToFirestore(post) {
    try {
      await addDoc(collection(db, 'blogPosts'), post);
      console.log("文章已成功添加到数据库");
    } catch (error) {
      console.error("添加文章失败: ", error);
      throw error;
    }
  }