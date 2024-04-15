import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

export const useGetFireStore = (path, documentId) => {
  const [firestore, setFirestore] = useState(null);
  useEffect(() => {
    if (!documentId) {
      console.log("documentId is undefined");
      return;
    }

    const fetchData = async () => {
      const docRef = doc(db, path, documentId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setFirestore(docSnapshot.data());
      } else {
        console.log("Document does not exist");
      }
    };
    fetchData();
  }, [path, documentId]);

  return firestore;
};
