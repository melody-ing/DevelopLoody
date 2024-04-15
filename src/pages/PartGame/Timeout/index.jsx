import React from "react";

const Timeout = ({ user, answer }) => {
  return (
    <div>
      <div>時間到</div>
      <div>{user.selected === answer ? "correct" : "wrong"}</div>
      <div>+{user.addScore}</div>
    </div>
  );
};

export default Timeout;
