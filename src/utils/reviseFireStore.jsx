import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

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

export const addFireStore = async (path, data) => {
  try {
    const documentId = uuidv4();
    await setDoc(doc(db, path, documentId), { ...data, id: documentId });
    console.log("Document written with ID: ", documentId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const deleteFireStore = async (path, documentId) => {
  try {
    await deleteDoc(doc(db, path, documentId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};
