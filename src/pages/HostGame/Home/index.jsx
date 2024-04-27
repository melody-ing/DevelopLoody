import React, { useEffect, useState } from "react";
import theme from "../../../components/css/theme";
import Buttons from "../../../components/Buttons";
import { styled } from "styled-components";
import { useGameStore } from "../../../utils/hook/useGameStore";
import { updateRealTime } from "../../../utils/reviseRealTime";
import { serverTimestamp } from "firebase/firestore";

const TimeLimit = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.tertiary};
  font-size: 5rem;
  width: auto;
  height: 8rem;
  line-height: 4rem;
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  right: 0;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.tertiary};
  font-size: 2rem;
  width: 18rem;
  height: 14rem;
  line-height: 4rem;

  p {
    font-size: 5rem;
  }
`;

const Home = ({ questions, users, documentId }) => {
  const { reply, setReply } = useGameStore();
  const [count, setCount] = useState(questions.timeLimit);

  useEffect(() => {
    const num = Object.values(users).filter(
      (user) => user.selected !== undefined
    )?.length;
    users && setReply(num);
  }, [users]);

  useEffect(() => {
    if (reply === 0)
      updateRealTime(`${documentId}`, { time: serverTimestamp() });
  }, [reply]);

  useEffect(() => {
    const countDown = setInterval(() => {
      setCount(count - 1);
      if (count <= 0) {
        updateRealTime(`${documentId}`, { state: "timeout" });
      }
    }, 1000);

    return () => clearInterval(countDown);
  }, [count]);

  return (
    <>
      <TimeLimit>{count}</TimeLimit>

      <Attenance>
        作答人數： <p>{reply}</p>
      </Attenance>
    </>
  );
};

export default Home;
