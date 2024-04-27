import React, { useEffect } from "react";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Lobby from "./Lobby";
import Score from "./Score";
import PrimaryBg from "../../components/css/PrimaryBg";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase";
import Media from "./Home/Media";
import ReactLoading from "react-loading";

const WrapGame = styled(PrimaryBg)`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const PartGame = () => {
  const { userId } = useGameStore();
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
  } = useGetRealTime();
  const realTime = realTimeData?.[getUrlDocumentId];
  const users = realTime?.users;
  const user = realTime?.users?.[userId];
  const qNumber = realTime?.question?.id;
  const state = realTime?.state;
  const qTime = realTime?.time;

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
    const confirmLeave = window.confirm("確定要離開當前頁面嗎?");
    navigate(null, "", "/part/game");
    if (confirmLeave) {
      removeRealTime(`${getUrlDocumentId}/users/${userId}`);
      navigate("/");
    }
  };

  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
    }

    function handleUnload() {
      removeRealTime(`${getUrlDocumentId}/users/${userId}`);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

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
    const questions = qbank.questions[qNumber];

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
            <Home questions={questions} />
            <Media questions={questions} />

            <Options
              questions={questions}
              user={user}
              qTime={qTime}
              addScore={addScore}
            />

            <Score user={user} />
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
