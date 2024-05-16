import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

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

// export const getFireStore = async (path, documentId) => {
//   const docRef = doc(db, path, documentId);
//   const unsubscribe = onSnapshot(docRef, (docSnap) => {
//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());
//       return docSnap.data();
//     } else {
//       console.log("No such document!");
//     }
//   });

//   return unsubscribe;
// };

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

export const addFireStore = async (path, data) => {
  try {
    const documentId = uuidv4();
    await setDoc(doc(db, path, documentId), { ...data, id: documentId });
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
