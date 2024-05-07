import React, { useEffect, useState } from "react";
import theme from "../../../components/css/theme";
import { styled } from "styled-components";
import { updateRealTime } from "../../../utils/reviseRealTime";

const WrapHome = styled.div`
  ${theme.breakpoints.sm} {
    background-color: ${theme.colors.secondary}66;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: end;
    position: absolute;
    right: 0;
    width: 30%;
  }
`;

const TimeLimit = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.info};
  font-size: 5rem;
  width: auto;
  height: 8rem;
  line-height: 4rem;

  ${theme.breakpoints.sm} {
    position: static;
    background-color: #ffffff00;
  }
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 55%;
  padding: 1rem;
  right: 0;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.info};
  font-size: 2rem;
  width: 16rem;
  height: 11rem;
  line-height: 4rem;

  p {
    font-size: 4.4rem;
  }

  ${theme.breakpoints.sm} {
    position: static;
    background-color: #ffffff00;
  }
`;

const Home = ({
  users,
  getUrlDocumentId,
  timeoutSec,
  audioRef,
  reply,
  setReply,
}) => {
  const [count, setCount] = useState(timeoutSec);

  useEffect(() => {
    setCount(timeoutSec);
  }, [timeoutSec]);

  useEffect(() => {
    const num = Object.values(users).filter(
      (user) => user.selected !== undefined
    )?.length;
    users && setReply(num);
  }, [users]);

  useEffect(() => {
    const countDown = setInterval(() => {
      setCount(count - 1);
      if (count <= 0) {
        setCount(0);
        updateRealTime(`${getUrlDocumentId}`, { state: "timeout" });
      }
    }, 1000);

    return () => clearInterval(countDown);
  }, [count]);

  return (
    <WrapHome>
      <TimeLimit>{count}</TimeLimit>
      <Attenance>
        作答人數： <p>{reply}</p>
      </Attenance>{" "}
      <audio autoPlay loop src="/bgm/game.mp3" ref={audioRef} />
    </WrapHome>
  );
};

export default Home;
