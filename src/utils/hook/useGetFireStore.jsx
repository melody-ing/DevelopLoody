import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDoc,
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export const useGetFireStore = (path, documentId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      console.log("getfirestore", "documentId is undefined");
      setIsLoading(false);
      return;
    }

    const docRef = doc(db, path, documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            setData(docSnapshot.data());
            setIsError(null);
          } else {
            console.log("Document does not exist");
            setData(null);
            setIsError(null);
          }
        } catch (err) {
          console.error("Error fetching document: ", err);
          setIsError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Error listening to document: ", err);
        setIsError(err.message);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [path, documentId]);

  return { data, isLoading, isError };
};

export const useGetFireStores = (path) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, path);
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        try {
          const fetchedData = snapshot.docs.map((doc) => doc.data());
          setData(fetchedData);
          setIsLoading(false);
        } catch (error) {
          setIsError(error.message);
          setIsLoading(false);
          setData(null);
        }
      },
      (error) => {
        setIsError(error.message);
        setIsLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [path]);

  return { data, isLoading, isError };
};
