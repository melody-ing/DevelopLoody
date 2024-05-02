import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import theme from "../../components/css/theme";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Lobby from "./Lobby";
import Score from "./Score";
import CountDown from "./CountDown";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTimeNavigate } from "../../utils/hook/useGetRealTime";
import { updateRealTime } from "../../utils/reviseRealTime";
import { useNavigate, useParams } from "react-router-dom";
import Media from "./Home/Media";
import ReactLoading from "react-loading";
import { Timestamp } from "firebase/firestore";
import GameAniBg from "@/components/css/GameAniBg";

const WrapGame = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const WrapQuestion = styled.div`
  display: flex;
  width: 100%;
`;

const Question = styled.h2`
  font-size: 3.6rem;
  width: 60%;
  height: auto;
  margin: 0 auto;
  margin-bottom: 2rem;
  background-color: ${theme.colors.light};
  margin-top: 4rem;

  ${theme.breakpoints.sm} {
    width: 90%;
    font-size: 2rem;
    line-height: 3.5rem;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const PartGame = () => {
  const userId = localStorage.getItem("userId");
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
  const [isAnswer, setIsAnswer] = useState(false);

  function setScore(time, userTime) {
    if (userTime !== null && time !== null) {
      time = time.seconds;
      userTime = userTime.seconds;
      const delayTime = parseInt(
        ((userTime - time) / questions.timeLimit) * 100
      );
      const addScore = delayTime <= 80 ? 1000 - delayTime * 9 : 280;
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
  console.log(user);

  if (qbank && user && qNumber !== null && users && state) {
    if (!user) navigate("/");
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
              qTime={qTime}
              addScore={addScore}
              isAnswer={isAnswer}
              setIsAnswer={setIsAnswer}
              getUrlDocumentId={getUrlDocumentId}
              userId={userId}
            />

            <Score
              user={user}
              userId={userId}
              getUrlDocumentId={getUrlDocumentId}
            />
            {isAnswer || (
              <CountDown questions={questions} timeoutSec={timeoutSec} />
            )}
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
            <Timeout
              user={user}
              questions={questions}
              answer={answer}
              setIsAnswer={setIsAnswer}
            />
            <Score
              user={user}
              isRank={true}
              getUrlDocumentId={getUrlDocumentId}
              userId={userId}
            />
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

        console.log(getUrlDocumentId, userId);
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
      <GameAniBg />
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
        <div>
          {state !== "lobby" && (
            <WrapQuestion>
              {" "}
              <Question>{title}</Question>
            </WrapQuestion>
          )}

          {content}
        </div>
      )}
    </WrapGame>
  );
};

export default PartGame;
