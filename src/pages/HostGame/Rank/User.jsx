import styled from "styled-components";
import theme from "../../../components/css/theme";
import CountUp from "react-countup";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Fire from "../svg/Fire";

const UsersRank = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: ${({ $lastRank }) => $lastRank * 8}rem;

  ${theme.breakpoints.sm} {
    top: ${({ $lastRank }) => $lastRank * 4}rem;
  }
`;

const UserRank = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 2rem auto;
  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;
  background-color: ${({ $rank }) => ($rank === 0 ? "#fff9bd" : "#fff")};

  ${theme.breakpoints.sm} {
    font-size: 2rem;
    padding: 1rem;
    margin: 1rem auto;
  }
`;

const Champion = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;

  svg {
    width: 3.2rem;
    height: 3.2rem;
    color: #c82500;
  }
`;

const User = ({ user }) => {
  gsap.registerPlugin(useGSAP);
  const rankRef = useRef(null);

  useGSAP(() => {
    gsap.to(rankRef.current, { top: user.rank * 80, duration: 2.56 });
  });

  return (
    <UsersRank className="rank" ref={rankRef} $lastRank={user.lastRank}>
      <UserRank className="try" $rank={user.rank}>
        <Champion>
          {" "}
          {user.rank === 0 && <Fire />}
          <p>{user.name}</p>
        </Champion>
        <CountUp
          start={user.score - user.addScore}
          end={user.score}
          duration={3.5}
        />
      </UserRank>
    </UsersRank>
  );
};

export default User;
