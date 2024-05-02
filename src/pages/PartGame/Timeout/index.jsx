import React, { useEffect } from "react";

const Timeout = ({ user, answer, setIsAnswer }) => {
  useEffect(() => {
    setIsAnswer(false);
  }, []);

  return (
    <div>
      <div>時間到</div>
      <div>{user.selected === answer ? "correct" : "wrong"}</div>
      <div>+{user.addScore}</div>
    </div>
  );
};

export default Timeout;
