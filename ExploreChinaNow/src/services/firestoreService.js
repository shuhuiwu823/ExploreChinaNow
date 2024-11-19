import { db } from '../firebase';
import { 
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const BLOGS_COLLECTION = "blogPosts";

// Initialize Firebase Storage
const storage = getStorage();

// General error logging
function logFirestoreError(action, error) {
  console.error(`${action} failed: `, error);
  throw error;
}

// **Retrieve all blog posts**
export async function getBlogPostsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("Fetching blog posts", error);
  }
}

// **Retrieve blog posts by a specific author**
export async function getUserBlogPostsFromFirestore(authorName) {
  try {
    const q = query(collection(db, BLOGS_COLLECTION), where('author', '==', authorName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("Fetching blog posts by author", error);
  }
}

// **Update a blog post**
export async function updateBlogPostInFirestore(postId, updatedData) {
  try {
    if (!postId) throw new Error("A valid post ID is required");
    const postRef = doc(db, BLOGS_COLLECTION, postId);
    await updateDoc(postRef, updatedData);
    console.log("Post updated successfully");
  } catch (error) {
    logFirestoreError("Updating blog post", error);
  }
}

// **Delete a specific blog**
export const deleteBlogPostFromFirestore = async (blogId) => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, blogId);
    await deleteDoc(blogDoc);
    console.log(`Blog ${blogId} deleted successfully`);
  } catch (error) {
    logFirestoreError("Deleting blog post", error);
  }
};

// **Paginate blog posts**
export async function getPaginatedBlogPosts(lastVisibleDoc = null, pageSize = 10) {
  try {
    let q = query(collection(db, BLOGS_COLLECTION), orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { posts, lastVisible };
  } catch (error) {
    logFirestoreError("Fetching paginated blog posts", error);
  }
}

// **Upload image to Firebase Storage and retrieve the URL**
export async function uploadImageToStorage(file) {
  try {
    const uniqueFileName = `${uuidv4()}_${file.name}`; // Ensure a unique file name
    const storageRef = ref(storage, `blog-images/${uniqueFileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref); // Return the download URL for the image
  } catch (error) {
    console.error("Image upload failed: ", error);
    throw error;
  }
}

// Add a new blog post to Firestore
export async function addBlogPostToFirestore(post, imageFiles = []) {
  try {
    // Upload images and get URLs
    const imageUrls = await Promise.all(
      imageFiles.map(file => uploadImageToStorage(file))
    );
    post.images = imageUrls;

    // Ensure line breaks (\n) are preserved; no special handling for '-'
    post.content = post.content.replace(/\r\n|\r/g, '\n'); // Normalize line breaks to '\n'

    // Add timestamp
    post.createdAt = serverTimestamp();

    // Save to Firestore
    await addDoc(collection(db, BLOGS_COLLECTION), post);
    console.log("Post successfully added!");
  } catch (error) {
    logFirestoreError("Adding blog post", error);
  }
}

