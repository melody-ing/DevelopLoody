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
  const [firestore, setFirestore] = useState(null);

  useEffect(() => {
    if (!documentId) {
      console.log("getfirestore", "documentId is undefined");
      return;
    }

    const docRef = doc(db, path, documentId);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setFirestore(docSnapshot.data());
      } else {
        console.log("Document does not exist");
        setFirestore(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [path, documentId]);

  return firestore;
};

export const useGetFireStores = (path) => {
  const [firestores, setFirestores] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, path);
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setFirestores(data);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [path]);

  return firestores;
};

// export const useGetFirestore = (path, documentId) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!documentId) {
//       console.log('getFirestore', 'documentId is undefined');
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const docRef = doc(db, path, documentId);
//         const docSnapshot = await getDoc(docRef);

//         if (docSnapshot.exists()) {
//           setData(docSnapshot.data());
//         } else {
//           console.log('Document does not exist');
//           setData(null);
//         }
//       } catch (error) {
//         console.error('getFirestore', error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [path, documentId]);

//   return { data, loading, error };
// };
