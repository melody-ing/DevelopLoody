import React from "react";
import Buttons from "../../../components/Buttons";

const Timeout = ({ user }) => {
  return (
    <div>
      <div>時間到</div>
      <div>{user.selected}wrong</div>
      <div>+{user.addScore}</div>
    </div>
  );
};

export default Timeout;
