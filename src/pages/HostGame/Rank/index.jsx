import styled from "styled-components";
import { ScrollArea } from "@/components/ui/scroll-area";

import User from "./User";
import theme from "@/components/css/theme";

const WrapRank = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapUsersRank = styled(ScrollArea)`
  width: 50%;
  height: 41.4rem;
  overflow: hidden;

  ${theme.breakpoints.sm} {
    width: 70%;
  }

  ${theme.breakpoints.xs} {
    width: 90%;
  }
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
