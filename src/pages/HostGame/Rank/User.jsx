import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import CountUp from "react-countup";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const UsersRank = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: ${({ $lastRank }) => $lastRank * 8}rem;
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

const User = ({ user, index }) => {
  gsap.registerPlugin(useGSAP);
  const rankRef = useRef(null);

  useGSAP(() => {
    gsap.to(rankRef.current, { top: user.rank * 80, duration: 3 });
  });

  return (
    <UsersRank className="rank" ref={rankRef} $lastRank={user.lastRank}>
      <UserRank className="try" $rank={user.rank}>
        <Champion>
          {" "}
          {user.rank === 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
              />
            </svg>
          )}
          <p>{user.name}</p>
        </Champion>
        <CountUp
          start={user.score - user.addScore}
          end={user.score}
          duration={4.9}
        />
      </UserRank>
    </UsersRank>
  );
};

export default User;
