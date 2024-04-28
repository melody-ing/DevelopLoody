import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BaseGlobalStyle from "./components/css/BaseGlobalStyle";
import { useGameStore } from "./utils/hook/useGameStore";
import { useGetRealTime } from "./utils/hook/useGetRealTime";
import { useGetFireStore } from "./utils/hook/useGetFireStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./utils/firebase";
import { getFireStore } from "./utils/reviseFireStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOnAuthStateChange } from "./utils/hook/useOnAuthStateChange";

const App = () => {
  const { setEventData, documentId, setQbankData, setUserId } = useGameStore();
  const {
    data: getEventData,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTime(documentId);
  const {
    data: getQbankData,
    isError,
    isLoading,
  } = useGetFireStore("qbank", documentId);
  const auth = getAuth(app);

  const userUid = useOnAuthStateChange();

  useEffect(() => {
    if (!userUid) return;
    const userData = getFireStore("users", userUid);
    userData.then((data) => {
      setUserId(data.userId);
    });
  }, [userUid]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //       const userData = getFireStore("users", uid);
  //       userData.then((data) => {
  //         setUserId(data.userId);
  //       });
  //       console.log(userData);
  //       console.log("User is signed in");
  //     } else {
  //       console.log("User is not signed in");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    if (getQbankData) {
      setQbankData(getQbankData);
    }
  }, [getQbankData]);

  return (
    <div>
      <BaseGlobalStyle />
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default App;
