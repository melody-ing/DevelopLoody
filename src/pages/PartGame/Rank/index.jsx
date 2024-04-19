import React from "react";
import styled from "styled-components";

const WrapRank = styled.div`
  font-size: 2.4rem;
`;

const Rank = ({ users, userId }) => {
  const userRank = Object.entries(users).sort(
    ([, a], [, b]) => b.score - a.score
  );
  const rank = userRank.findIndex(([id]) => id === userId);

  return <WrapRank>你的排名為：{rank + 1}</WrapRank>;
};

export default Rank;
