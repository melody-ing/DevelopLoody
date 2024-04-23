import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BaseGlobalStyle from "./components/css/BaseGlobalStyle";
import { useGameStore } from "./utils/hook/useGameStore";
import { useGetRealTime } from "./utils/hook/useGetRealTime";
import { useGetFireStore } from "./utils/hook/useGetFireStore";

const App = () => {
  const { setEventData, documentId, setQbankData } = useGameStore();
  const getEventData = useGetRealTime(documentId);
  const getQbankData = useGetFireStore("qbank", documentId);

  useEffect(() => {
    if (getQbankData) {
      setQbankData(getQbankData);
    }
  }, [getQbankData]);

  return (
    <div>
      <BaseGlobalStyle />
      <Outlet />
    </div>
  );
};

export default App;
