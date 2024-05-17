import { doc, updateDoc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getFireStore = async (path, documentId) => {
  const docRef = doc(db, path, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export const updateFireStore = async (path, documentId, data) => {
  try {
    const docRef = doc(db, path, documentId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("updateFireStore", error);
    throw error;
  }
};

export const setFireStore = async (path, documentId, data) => {
  try {
    await setDoc(doc(db, path, documentId), data, { merge: true });
    // console.log("Document written with ID: ", documentId);
  } catch (e) {
    // console.error("Error adding document: ", e);
  }
};

export const deleteFireStore = async (path, documentId) => {
  try {
    await deleteDoc(doc(db, path, documentId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};
