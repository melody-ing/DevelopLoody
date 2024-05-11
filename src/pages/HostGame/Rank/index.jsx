import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import CountUp from "react-countup";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import User from "./User";

const WrapRank = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapUsersRank = styled(ScrollArea)`
  width: 50%;
  height: 41.4rem;
  overflow: hidden;
`;
const UsersRank = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const UserRank = styled.div`
  top: ${({ $lastRank }) => $lastRank * 9}rem;
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 2rem auto;
  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;
  background-color: #fff;
`;

const Rank = ({ audioRef, arrayUsers }) => {
  const newArrayUsers = arrayUsers
    .sort((a, b) => b.score - a.score)
    .map((user, index) => ({ ...user, rank: index }))
    .sort((a, b) => b.score - b.addScore - (a.score - a.addScore))
    .map((user, index) => ({ ...user, lastRank: index }));

  return (
    <WrapRank>
      <WrapUsersRank className="try">
        {newArrayUsers
          .sort((a, b) => b.score - b.addScore - (a.score - a.addScore))
          .map((user, index) => {
            return <User key={index} index={index} user={user} />;
          })}
      </WrapUsersRank>
      <audio autoPlay src="/bgm/rank.mp3" ref={audioRef} />
    </WrapRank>
  );
};

export default Rank;
