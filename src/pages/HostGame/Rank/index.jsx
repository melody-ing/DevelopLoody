import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { ScrollArea } from "@/components/ui/scroll-area";

const WrapRank = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapUsersRank = styled(ScrollArea)`
  width: 60%;

  height: calc(100vh - 20rem);
`;

const UserRank = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 2rem auto;
  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;
  background-color: #fff;
`;

const Rank = ({ users, audioRef }) => {
  return (
    <WrapRank>
      <WrapUsersRank>
        {Object.values(users)
          .sort((a, b) => b.score - a.score)
          .map((user, index) => {
            return (
              <UserRank key={index}>
                <div>{user.name}</div>
                <div>{user.score}</div>
              </UserRank>
            );
          })}
      </WrapUsersRank>
      <audio src="/bgm/rank.mp3" ref={audioRef} />
    </WrapRank>
  );
};

export default Rank;
