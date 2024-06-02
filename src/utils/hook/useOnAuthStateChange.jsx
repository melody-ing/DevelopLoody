import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export function useOnAuthStateChange() {
  const [getUid, setGetUid] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setGetUid(uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);
  return getUid;
}
