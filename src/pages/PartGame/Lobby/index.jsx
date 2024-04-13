import React from "react";
import { useGameStore } from "../../../utils/hook/useGameStore";
import { useNavigate } from "react-router-dom";

const Lobby = ({ user }) => {
  return (
    <div>
      <h3>Hi:{user?.name}</h3>
      <p>等待其他人的加入</p>
    </div>
  );
};

export default Lobby;
