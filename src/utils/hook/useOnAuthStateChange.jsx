import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useOnAuthStateChange() {
  const [getUid, setGetUid] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setGetUid(uid);
        // console.log("User is signed in");
      } else {
        // console.log("User is not signed in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);
  return getUid;
}
