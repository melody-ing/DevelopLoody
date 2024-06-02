import { doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getFireStore = async (path, documentId) => {
  const docRef = doc(db, path, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
};

export const updateFireStore = async (path, documentId, data) => {
  try {
    const docRef = doc(db, path, documentId);
    await updateDoc(docRef, data);
  } catch (error) {
    // console.error("updateFireStore", error);
  }
};

export const setFireStore = async (path, documentId, data) => {
  try {
    await setDoc(doc(db, path, documentId), data, { merge: true });
  } catch (e) {
    // console.error("Error adding document: ", e);
  }
};

export const deleteFireStore = async (path, documentId) => {
  try {
    await deleteDoc(doc(db, path, documentId));
  } catch (e) {
    // console.error("Error deleting document: ", e);
  }
};
