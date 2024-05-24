import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import Options from "./Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Media from "./Media";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTimeNavigate } from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import ReactLoading from "react-loading";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import { Timestamp } from "firebase/firestore";
import GameAniBg from "@/components/css/GameAniBg";
import { useStore } from "@/utils/hook/useStore";
import On from "./svg/On";
import Off from "./svg/Off";

const WrapGame = styled.div`
  width: 100%;
  height: 100vh;

  position: relative;
`;

const WrapBtns = styled.div`
  position: fixed;
  right: 1rem;
  top: 46%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  ${theme.breakpoints.sm} {
    top: 53%;
    top: ${({ $state }) => ($state === "rank" ? "80%" : "55%")};
  }
`;

const Question = styled.h2`
  font-size: 4rem;
  line-height: 6rem;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 2rem;
  height: auto;
  min-height: 8rem;
  padding: 2rem;
  background-color: #f4f4f48d;

  ${theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 5rem;
  }

  ${theme.breakpoints.xs} {
    font-size: 2rem;
    line-height: 4rem;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const SoundButton = styled.div`
  background-color: ${({ $isPlayBgm }) => ($isPlayBgm ? "#e8c83b" : "#b69e35")};
  box-shadow: 0 3.4px 0px 0 #b69e35;

  width: 10rem;
  height: 6rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const HostGame = () => {
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
  } = useGetRealTimeNavigate(getUrlDocumentId, "/dashboard");
  const qNumber = realTimeData?.question.id;
  const state = realTimeData?.state;
  const users = realTimeData?.users;
  const arrayUsers =
    users && Object.values(users)?.filter((user) => user.isOnline === true);
  const time = realTimeData?.time;
  const question = realTimeData?.question;
  const questions = qbank?.questions[qNumber];
  const [timeoutSec, setTimeoutSec] = useState(null);
  const { isPlayBgm, setIsPlayBgm } = useStore();
  const [reply, setReply] = useState(0);
  const audioRef = useRef(null);

  const navigate = useNavigate();

  useOnAuthStateChange();

  window.onpopstate = () => {
    const confirmLeave = window.confirm("確定要結束遊戲嗎?");
    if (confirmLeave) {
      removeRealTime(getUrlDocumentId);
      navigate("/dashboard");
    } else {
      navigate(`/hostgame/${getUrlDocumentId}`);
    }
  };

  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
    }

    function handleUnload() {
      removeRealTime(getUrlDocumentId);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const timeLimit = questions?.timeLimit;
    const nowTime = Timestamp.now().seconds;
    const timeoutTime = time?.seconds + timeLimit;

    setTimeoutSec(timeoutTime - nowTime - 1);
  }, [question, questions]);

  useEffect(() => {
    if (audioRef.current !== null && isPlayBgm) audioRef.current.muted = false;
  }, [audioRef.current]);

  useEffect(() => {
    if (audioRef.current !== null) {
      isPlayBgm
        ? (audioRef.current.muted = false)
        : (audioRef.current.muted = true);
    }
  }, [isPlayBgm, audioRef, state]);

  let title = "";
  let button = "";
  let content = null;
  let nextState = "";

  if (qbank && qNumber !== null && users) {
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "game":
        title = questions.title;
        button = "略過";
        content = (
          <>
            <Home
              questions={questions}
              timeoutSec={timeoutSec}
              getUrlDocumentId={getUrlDocumentId}
              isPlayBgm={isPlayBgm}
              audioRef={audioRef}
              reply={reply}
              setReply={setReply}
              arrayUsers={arrayUsers}
            />
            <Media questions={questions} />
            {questions.type === "sa" || (
              <Options questions={questions} state={state} />
            )}
          </>
        );
        if (reply === arrayUsers.length)
          updateRealTime(getUrlDocumentId, { state: "timeout" });
        nextState = "timeout";
        break;
      case "timeout":
        title = questions.title;
        button = qNumber === qbank.questions.length - 1 ? "結束" : "排名";
        content = (
          <>
            <Timeout
              questions={questions}
              arrayUsers={arrayUsers}
              qbank={qbank}
              qNumber={qNumber}
              audioRef={audioRef}
              setReply={setReply}
            />

            <Options questions={questions} answer={answer} state={state} />
          </>
        );
        nextState = "rank";
        break;
      case "rank":
        title = "記分板";
        button = `第${qNumber + 2}題`;
        content = (
          <Rank
            arrayUsers={arrayUsers}
            getUrlDocumentId={getUrlDocumentId}
            audioRef={audioRef}
          />
        );
        nextState = "game";
        break;
      case "end":
        title = "最終排名";
        button = "首頁";
        content = (
          <>
            <End
              arrayUsers={arrayUsers}
              audioRef={audioRef}
              isPlayBgm={isPlayBgm}
            />
          </>
        );
        updateRealTime(`${getUrlDocumentId}/question`, { id: 0 });
        nextState = "home";

        break;
      default:
        title = questions.title;
        button = "略過";
        content = (
          <>
            <Home questions={questions} />
            <Options questions={questions} />
          </>
        );
        nextState = "timeout";
        break;
    }
  }

  function setQNumber(qNumber) {
    updateRealTime(`${getUrlDocumentId}/question`, { id: qNumber + 1 });
  }

  function handleState() {
    updateRealTime(getUrlDocumentId, { state: nextState });

    if (state === "timeout") {
      const newUsers = Object.fromEntries(
        Object.entries(users).map(([key, value]) => [
          key,
          {
            addScore: value.addScore,
            name: value.name,
            score: value.score,
            time: value.time,
            isOnline: value.isOnline,
          },
        ])
      );

      updateRealTime(`${getUrlDocumentId}`, { users: newUsers });
    }

    if (state === "rank") {
      updateRealTime(`${getUrlDocumentId}`, { time: Timestamp.now() });
    }
    if (state === "end") {
      removeRealTime(getUrlDocumentId);
      navigate("/dashboard");
    } else {
      state === "rank" && setQNumber(qNumber);
      qNumber === qbank.questions.length - 1 &&
        state === "timeout" &&
        updateRealTime(getUrlDocumentId, { state: "end" });
      setReply(0);
    }
  }

  return (
    <WrapGame>
      <GameAniBg />
      {isLoading || isRTLoading ? (
        <Loading>
          <ReactLoading
            type="bars"
            color={theme.colors.primary}
            height={100}
            width={100}
          />
        </Loading>
      ) : (
        <>
          {state === "end" || <Question>{title}</Question>}
          <WrapBtns $state={state}>
            <SoundButton
              type="sound"
              onClick={setIsPlayBgm}
              $isPlayBgm={isPlayBgm}
            >
              {isPlayBgm ? <On /> : <Off />}
            </SoundButton>
            <div onClick={handleState}>
              <Buttons style={{ width: "10rem" }}>{button}</Buttons>
            </div>
          </WrapBtns>
          {content}
        </>
      )}
    </WrapGame>
  );
};

export default HostGame;
