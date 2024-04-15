import React, { useEffect } from "react";
import Buttons from "../../../components/Buttons";

const Timeout = ({ setReply }) => {
  useEffect(() => {
    setReply(0);
  }, []);

  return (
    <div>
      <div>chart</div>
    </div>
  );
};

export default Timeout;
