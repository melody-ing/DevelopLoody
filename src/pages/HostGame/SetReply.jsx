import { useGameStore } from "@/utils/hook/useGameStore";
import React, { useEffect } from "react";

const SetReply = () => {
  const { setReply } = useGameStore();

  useEffect(() => {
    setReply(0);
  }, []);

  return <></>;
};

export default SetReply;
