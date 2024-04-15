import React, { useState } from "react";
import { useGetRealTime } from "../../../utils/hook/useGetRealTime";

const Rank = ({ users, userId }) => {
  const userRank = Object.entries(users).sort(
    ([, a], [, b]) => b.score - a.score
  );
  const rank = userRank.findIndex(([id]) => id === userId);

  console.log(userRank);
  return <div>你的排名為：{rank + 1}</div>;
};

export default Rank;
