import React from "react";
import Header from "../../components/Header";
import { useGameStore } from "../../utils/hook/useGameStore";

const DashBoard = () => {
  const { userId } = useGameStore();

  return (
    <div>
      <Header />
      <a href={`/create/${userId}`}>create</a>
    </div>
  );
};

export default DashBoard;
