import React, { useEffect } from "react";
import { useGetRealTime } from "../../../utils/hook/useGetRealTime";
import { updateRealTime } from "../../../utils/updateRealTime";

const Timeout = ({ user, answer }) => {
  const realTime = useGetRealTime(`users/-NvLufWobRKj-dtMesOb`);

  return (
    <div>
      <div>時間到</div>
      <div>{realTime?.selected === answer ? "correct" : "wrong"}</div>
      <div>+{user.addScore}</div>
    </div>
  );
};

export default Timeout;
