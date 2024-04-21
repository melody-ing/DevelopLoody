import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

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
    console.log("Document written with ID: ", documentId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
