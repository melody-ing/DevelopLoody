import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Lobby from "./Lobby";
import Score from "./Score";
import CountDown from "./CountDown";
import PrimaryBg from "../../components/css/PrimaryBg";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import {
  useGetRealTime,
  useGetRealTimeNavigate,
} from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase";
import Media from "./Home/Media";
import ReactLoading from "react-loading";
import DynamicBG from "@/components/tool/DynamicBG";
import { Timestamp } from "firebase/firestore";

const WrapGame = styled.div`
  background-color: #ebdb86;
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 4rem;
`;

const Question = styled.h2`
  font-size: 3.6rem;
  width: 60%;
  height: auto;
  margin: 0 auto;
  margin-bottom: 2rem;
  background-color: ${theme.colors.light};

  ${theme.breakpoints.sm} {
    width: 90%;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const PartGame = () => {
  const userId = localStorage.getItem("partId");
  const navigate = useNavigate();
  const { documentId: getUrlDocumentId } = useParams();

  const {
    data: qbank,
    isError,
    isLoading,
  } = useGetFireStore("qbank", getUrlDocumentId);
  const {
    data: realTimeData,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTimeNavigate(getUrlDocumentId, "/");
  const realTime = realTimeData;
  const users = realTime?.users;
  const user = realTime?.users?.[userId];
  const qNumber = realTime?.question?.id;
  const state = realTime?.state;
  const qTime = realTime?.time;
  const question = realTime?.question;
  const questions = qbank?.questions?.[qNumber];
  const [timeoutSec, setTimeoutSec] = useState(null);

  function setScore(time, userTime) {
    if (userTime & time) {
      const delayTime = parseInt((userTime - time) / 1000);
      const addScore = delayTime <= 10 ? 1000 - delayTime * 79 : 210;
      if (user.selected !== undefined)
        updateRealTime(`${getUrlDocumentId}/users/${userId}`, { addScore });

      return addScore;
    }
    updateRealTime(`${getUrlDocumentId}/users/${userId}`, { addScore: 0 });
  }

  window.onpopstate = () => {
    navigate("/");
  };

  useEffect(() => {
    const timeLimit = questions?.timeLimit;
    const nowTime = Timestamp.now().seconds;
    const timeoutTime = qTime?.seconds + timeLimit;
    setTimeoutSec(timeoutTime - nowTime - 1);
    // 因為fetch會延遲所以我把秒數減少一點
    console.log(qTime?.seconds, nowTime, timeoutTime, timeLimit, timeoutSec);
  }, [question, questions]);

  let title = "";
  let content = null;
  let addScore = 0;
  let nextState = "";

  useEffect(() => {
    if (!userId) {
      setTimeout(() => {
        navigate("/");
      }, 0);
    }
  }, [userId, navigate]);

  if (qbank && user && qNumber !== null && users && state) {
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "lobby":
        title = questions.title;
        content = <Lobby user={user} />;
        break;

      case "game":
        title = questions.title;
        content = (
          <>
            <Media questions={questions} />

            <Options
              questions={questions}
              user={user}
              qTime={qTime}
              addScore={addScore}
            />

            <Score user={user} />
            <CountDown questions={questions} timeoutSec={timeoutSec} />
          </>
        );
        nextState = "timeout";
        user.selected === answer
          ? (addScore = setScore(qTime, user.time))
          : (addScore = setScore(null, null));

        break;

      case "timeout":
        title = questions.title;
        content = (
          <>
            <Timeout user={user} questions={questions} answer={answer} />
            <Score user={user} isRank={true} />
          </>
        );
        nextState = "rank";

        break;
      case "rank":
        title = questions.title;
        content = (
          <>
            <Rank userId={userId} user={user} users={users} />
            <Score user={user} />
          </>
        );
        nextState = "rank";
        updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
          selected: null,
        });
        break;

      case "end":
        title = "結束";
        content = (
          <>
            <Rank userId={userId} user={user} users={users} />
            <End />
          </>
        );
        break;
      default:
        navigate("/");
    }
  }

  return (
    <WrapGame>
      {isLoading || isRTLoading ? (
        <Loading>
          <ReactLoading
            type="bars"
            color={theme.colors.light}
            height={100}
            width={100}
          />
        </Loading>
      ) : (
        <>
          {state !== "lobby" && <Question>{title}</Question>}

          {content}
        </>
      )}
    </WrapGame>
  );
};

export default PartGame;
