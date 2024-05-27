import { useEffect, useState } from "react";
import { styled } from "styled-components";
import theme from "../../components/css/theme";
import Options from "./Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import Lobby from "./Lobby";
import Score from "./Score";
import CountDown from "./CountDown";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTimeNavigate } from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import { useNavigate, useParams } from "react-router-dom";
import Media from "./Media";
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
  position: fixed;
  top: 1rem;
`;

const Question = styled.h2`
  font-size: 3rem;
  line-height: 5rem;
  width: 65%;
  height: auto;
  margin: 0 auto;
  margin-bottom: 2rem;
  background-color: ${theme.colors.light};
  margin-top: 5.5rem;

  ${theme.breakpoints.sm} {
    width: 90%;
    font-size: 2.2rem;
    line-height: 3.5rem;
    padding: 0.5rem;
    margin-top: 4.4rem;
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
    // isError,
    isLoading,
  } = useGetFireStore("qbank", getUrlDocumentId);
  const {
    data: realTimeData,
    // isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTimeNavigate(getUrlDocumentId, "/");
  const realTime = realTimeData;
  const users = realTime?.users;

  const {
    data: user,
    // isError: isUserError,
    // isLoading: isUserLoading,
  } = useGetRealTimeNavigate(`${getUrlDocumentId}/users/${userId}`, "/");
  const qNumber = realTime?.question?.id;
  const state = realTime?.state;
  const qTime = realTime?.time;
  const question = realTime?.question;
  const questions = qbank?.questions?.[qNumber];
  const [timeoutSec, setTimeoutSec] = useState(null);

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

  function setReturningStatus(isReturning) {
    sessionStorage.setItem("isReturning", isReturning);
  }

  function getReturningStatus() {
    return sessionStorage.getItem("isReturning") === "true";
  }

  window.onpopstate = () => {
    let isReturning = getReturningStatus();
    setReturningStatus(!isReturning);

    if (!isReturning) {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        isOnline: true,
      });
    } else {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        isOnline: false,
      });
    }
  };

  useEffect(() => {
    if (!isRTLoading)
      if (realTime !== null && !("id" in realTime)) {
        removeRealTime(getUrlDocumentId);
      }
  }, [realTime]);

  useEffect(() => {
    function handleLoad() {
      setReturningStatus(true);
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        isOnline: true,
      });
    }

    function handleUnload() {
      updateRealTime(`${getUrlDocumentId}/users/${userId}`, {
        isOnline: false,
      });
      sessionStorage.removeItem("isReturning");
    }

    window.addEventListener("load", handleLoad);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    setReturningStatus(true);
  }, []);

  useEffect(() => {
    const timeLimit = questions?.timeLimit;
    const nowTime = Timestamp.now().seconds;
    const timeoutTime = qTime?.seconds + timeLimit;
    setTimeoutSec(timeoutTime - nowTime - 1);
  }, [question, questions]);

  useEffect(() => {
    if (!isRTLoading) {
      realTimeData || navigate("/entry");
    }
  }, [realTimeData, isRTLoading]);

  let title = "";
  let content = null;
  let addScore = 0;

  if (qbank && user && qNumber !== null && users && state) {
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "lobby":
        title = qbank?.name;
        content = <Lobby user={user} />;
        break;

      case "game":
        title = questions.title;
        content = (
          <>
            {(user.selected === undefined || user.selected === "") && (
              <Media questions={questions} />
            )}

            <Options
              questions={questions}
              qTime={qTime}
              addScore={addScore}
              getUrlDocumentId={getUrlDocumentId}
              userId={userId}
              user={user}
            />

            <Score
              user={user}
              userId={userId}
              getUrlDocumentId={getUrlDocumentId}
            />
            {(user.selected === "" || user.selected === undefined) && (
              <CountDown questions={questions} timeoutSec={timeoutSec} />
            )}
          </>
        );
        user.selected === answer
          ? (addScore = setScore(qTime, user.time))
          : (addScore = setScore(null, null));

        break;

      case "timeout":
        title = questions.title;
        content = (
          <>
            <Timeout user={user} questions={questions} answer={answer} />
            <Score
              user={user}
              isRank={true}
              getUrlDocumentId={getUrlDocumentId}
              userId={userId}
            />
          </>
        );

        break;
      case "rank":
        title = questions.title;
        content = (
          <>
            <Rank userId={userId} user={user} users={users} />
            <Score user={user} />
          </>
        );
        break;

      case "end":
        title = "遊戲結束";
        content = (
          <>
            <Rank userId={userId} user={user} users={users} />
          </>
        );
        break;
      default:
        navigate("/entry");
    }
  }

  return (
    realTimeData &&
    user && (
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
            {(user.selected === undefined || user.selected === "") && (
              <WrapQuestion>
                <Question>{title}</Question>
              </WrapQuestion>
            )}

            {content}
          </div>
        )}
      </WrapGame>
    )
  );
};

export default PartGame;
