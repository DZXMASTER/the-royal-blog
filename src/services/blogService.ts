import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

// Add a blog post
export const addBlogPost = async (
  title: string,
  content: string,
  authorId: string,
  ) => {
  
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      title,
      content,
      authorId,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
};

// Get all blog posts
export const getAllBlogPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

// Update a blog post
export const updateBlogPost = async (id: string, data: { title?: string; content?: string }) => {
  try {
    await updateDoc(doc(db, "blogs", id), data);
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};
