import { db } from '../firebase';
import { 
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 初始化 Firebase Storage
const storage = getStorage();

// 通用错误日志
function logFirestoreError(action, error) {
  console.error(`${action} 失败: `, error);
  throw error;
}

// **获取所有博客文章**
export async function getBlogPostsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("获取博客文章", error);
  }
}

// **获取指定作者的博客文章**
export async function getUserBlogPostsFromFirestore(authorName) {
  try {
    const q = query(collection(db, 'blogPosts'), where('author', '==', authorName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("获取指定作者的博客文章", error);
  }
}

// // **添加博客文章**
// export async function addBlogPostToFirestore(post, imageFiles = null) {
//   try {
//     if (!post.title || !post.author || !post.content) {
//       throw new Error('标题、作者和内容是必填字段');
//     }

//     // 如果提供了图片文件，则上传图片
//     if (imageFiles && imageFiles.length > 0) {
//       const imageUrls = await Promise.all(
//         imageFiles.map(file => uploadImageToStorage(file))
//       );
//       post.images = imageUrls; // 将图片 URL 添加到文章数据
//     } else {
//       post.images = []; // 如果没有图片，设置为空数组
//     }

//     // 保存文章到 Firestore
//     await addDoc(collection(db, 'blogPosts'), post);
//     console.log("文章已成功添加到数据库");
//   } catch (error) {
//     logFirestoreError("添加文章", error);
//   }
// }

// **更新博客文章**
export async function updateBlogPostInFirestore(postId, updatedData) {
  try {
    if (!postId) throw new Error("需要提供有效的文章 ID");
    const postRef = doc(db, 'blogPosts', postId);
    await updateDoc(postRef, updatedData);
    console.log("文章已更新");
  } catch (error) {
    logFirestoreError("更新博客文章", error);
  }
}

// **删除博客文章**
export async function deleteBlogPostFromFirestore(postId) {
  try {
    if (!postId) throw new Error("需要提供有效的文章 ID");
    const postRef = doc(db, 'blogPosts', postId);
    await deleteDoc(postRef);
    console.log("文章已删除");
  } catch (error) {
    logFirestoreError("删除博客文章", error);
  }
}

// **分页加载博客文章**
export async function getPaginatedBlogPosts(lastVisibleDoc = null, pageSize = 10) {
  try {
    let q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { posts, lastVisible };
  } catch (error) {
    logFirestoreError("获取分页博客文章", error);
  }
}


// 上传图片到 Firebase Storage 并获取 URL
export async function uploadImageToStorage(file) {
  try {
    const storageRef = ref(storage, `blog-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref); // 返回图片的下载 URL
  } catch (error) {
    console.error("上传图片失败：", error);
    throw error;
  }
}

// 添加博客文章到 Firestore，支持图片
export async function addBlogPostToFirestore(post, imageFiles = []) {
  try {
    // 上传图片并获取 URL
    const imageUrls = await Promise.all(
      imageFiles.map(file => uploadImageToStorage(file))
    );
    post.images = imageUrls; // 将图片 URL 添加到文章数据

    // 保存文章到 Firestore
    await addDoc(collection(db, 'blogPosts'), post);
    console.log("文章已成功添加到数据库，包含图片");
  } catch (error) {
    console.error("添加文章失败：", error);
    throw error;
  }
}

