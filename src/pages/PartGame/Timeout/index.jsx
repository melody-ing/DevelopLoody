import React, { useEffect } from "react";
import { useGetRealTime } from "../../../utils/hook/useGetRealTime";
import { useGameStore } from "../../../utils/hook/useGameStore";

const Timeout = ({ user, answer }) => {
  const { userId, documentId } = useGameStore();
  const realTime = useGetRealTime(`${documentId}/users/${userId}`);

  return (
    <div>
      <div>時間到</div>
      <div>{realTime?.selected === answer ? "correct" : "wrong"}</div>
      <div>+{user.addScore}</div>
    </div>
  );
};

export default Timeout;
