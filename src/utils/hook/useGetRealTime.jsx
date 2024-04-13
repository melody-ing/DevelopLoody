import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const useGetRealTime = (path) => {
  const [realTime, setRealTime] = useState(null);

  useEffect(() => {
    const userRef = ref(database, path);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          console.log("Users data:", users);
          setRealTime(users);
        } else {
          console.log("No data available");
        }
      },
      (error) => {
        console.error("Error fetching users data:", error);
      }
    );

    // 在組件卸載時清理監聽器
    return () => unsubscribe();
  }, []);
  return realTime;
};
