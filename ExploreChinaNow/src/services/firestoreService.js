import { db } from '../firebase';
import {
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const BLOGS_COLLECTION = "blogPosts";

// Initialize Firebase Storage
const storage = getStorage();

/**
 * Logs Firestore errors with a consistent format and throws the error.
 *
 * @function logFirestoreError
 * @param {string} action - The action being performed (e.g., "Fetching blog posts").
 * @param {Error} error - The error that occurred.
 * @throws {Error} The same error is re-thrown after logging.
 */
function logFirestoreError(action, error) {
  console.error(`${action} failed: `, error);
  throw error;
}

/**
 * Retrieves all blog posts from the Firestore collection.
 *
 * @async
 * @function getBlogPostsFromFirestore
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of blog post objects.
 */
export async function getBlogPostsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("Fetching blog posts", error);
  }
}

/**
 * Retrieves blog posts authored by a specific user.
 *
 * @async
 * @function getUserBlogPostsFromFirestore
 * @param {string} authorName - The name of the author.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of blog post objects.
 */
export async function getUserBlogPostsFromFirestore(authorName) {
  try {
    const q = query(collection(db, BLOGS_COLLECTION), where('author', '==', authorName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    logFirestoreError("Fetching blog posts by author", error);
  }
}

/**
 * Updates a specific blog post in Firestore with new data.
 *
 * @async
 * @function updateBlogPostInFirestore
 * @param {string} postId - The ID of the blog post to update.
 * @param {Object} updatedData - The updated data to apply to the blog post.
 * @throws {Error} Throws an error if the post ID is invalid or the update fails.
 */
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

/**
 * Deletes a blog post from Firestore.
 *
 * @async
 * @function deleteBlogPostFromFirestore
 * @param {string} blogId - The ID of the blog post to delete.
 * @returns {Promise<void>} A promise that resolves when the blog post is deleted.
 */
export const deleteBlogPostFromFirestore = async (blogId) => {
  try {
    const blogDoc = doc(db, BLOGS_COLLECTION, blogId);
    await deleteDoc(blogDoc);
    console.log(`Blog ${blogId} deleted successfully`);
  } catch (error) {
    logFirestoreError("Deleting blog post", error);
  }
};

/**
 * Retrieves paginated blog posts from Firestore.
 *
 * @async
 * @function getPaginatedBlogPosts
 * @param {Object|null} lastVisibleDoc - The last document from the previous page (optional).
 * @param {number} pageSize - The number of blog posts per page (default: 10).
 * @returns {Promise<Object>} A promise that resolves to an object containing posts and the last visible document.
 */
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

/**
 * Uploads an image to Firebase Storage and retrieves its download URL.
 *
 * @async
 * @function uploadImageToStorage
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} A promise that resolves to the image's download URL.
 */
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

/**
 * Adds a new blog post to Firestore and uploads associated images.
 *
 * @async
 * @function addBlogPostToFirestore
 * @param {Object} post - The blog post object containing title, author, and content.
 * @param {Array<File>} [imageFiles=[]] - An array of image files to upload.
 * @returns {Promise<void>} A promise that resolves when the blog post is successfully added.
 */
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
