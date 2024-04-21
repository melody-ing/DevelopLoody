import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getDoc, doc, setDoc, addDoc, collection } from "firebase/firestore";

export const useGetFireStore = (path, documentId) => {
  const [firestore, setFirestore] = useState(null);
  useEffect(() => {
    if (!documentId) {
      console.log("getfirestore", "documentId is undefined");
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

export const useSetFirestore = (path, documentId, data) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) {
      console.log("updatefirestore", "documentId is undefined");
      return;
    }

    const updateData = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, path, documentId);
        await setDoc(docRef, data, { merge: true });
      } catch (error) {
        console.error("updateFirestore", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    updateData();
  }, [path, documentId, data]);

  return { loading, error };
};
