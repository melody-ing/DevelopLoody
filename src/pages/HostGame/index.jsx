import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import Media from "./Home/Media";
import SetReply from "./SetReply";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ReactLoading from "react-loading";

const WrapGame = styled.div`
  width: 100%;
  height: 94vh;
  position: relative;
`;

const WrapBtn = styled.div`
  position: fixed;
  right: 3rem;
  top: 60%;
`;

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const HostGame = () => {
  const { userId, reply, setReply } = useGameStore();
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
  const qNumber = realTimeData?.[getUrlDocumentId]?.question.id;
  const state = realTimeData?.[getUrlDocumentId]?.state;
  const users = realTimeData?.[getUrlDocumentId]?.users;
  const time = realTimeData?.[getUrlDocumentId]?.time;

  const navigate = useNavigate();
  const prevUsersRef = useRef();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in");
      } else {
        console.log("User is not signed in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  // window.onpopstate = () => {
  //   const confirmLeave = window.confirm("確定要離開當前頁面嗎?");
  //   if (confirmLeave) {
  //     navigate("/");
  //     updateRealTime(getUrlDocumentId, { state: "home" });
  //     removeRealTime(getUrlDocumentId);
  //     return;
  //   }
  //   navigate(`/host/game/${getUrlDocumentId}`);
  // };

  // window.close = () => {
  //   navigate("/");
  //   updateRealTime(getUrlDocumentId, { state: "home" });
  //   removeRealTime(getUrlDocumentId);
  // };

  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
    }

    function handleUnload() {
      updateRealTime(getUrlDocumentId, { state: "home" });
      removeRealTime(getUrlDocumentId);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  });

  let title = "";
  let button = "";
  let content = null;
  let nextState = "";

  // useEffect(() => {
  //   if (users === null && prevUsersRef.current !== (null && undefined)) {
  //     console.log("nulll");
  //     navigate("/host");
  //     updateRealTime(getUrlDocumentId, { state: "lobby" });
  //     removeRealTime(getUrlDocumentId);
  //   }
  //   console.log(users);
  //   prevUsersRef.current = users;
  // }, [users]);

  if (qbank && qNumber !== null && users) {
    const questions = qbank.questions[qNumber];
    const answer = qbank.questions[qNumber].answer;
    switch (state) {
      case "game":
        title = questions.title;
        button = "略過";
        content = (
          <>
            <Home
              questions={questions}
              users={users}
              getUrlDocumentId={getUrlDocumentId}
            />
            <Media questions={questions} />
            {questions.type === "sa" || <Options questions={questions} />}
          </>
        );
        if (reply === Object.values(users).length)
          updateRealTime(getUrlDocumentId, { state: "timeout" });
        nextState = "timeout";
        break;
      case "timeout":
        title = questions.title;
        button = "排名";
        content = (
          <>
            {questions.type === "sa" || (
              <Timeout
                questions={questions}
                users={users}
                setReply={setReply}
                qbank={qbank}
                qNumber={qNumber}
              />
            )}
            <SetReply />
            <Options questions={questions} answer={answer} />
          </>
        );
        nextState = "rank";
        break;
      case "rank":
        title = "記分板";
        button = "下一題";
        content = (
          <Rank
            users={users}
            getUrlDocumentId={getUrlDocumentId}
            userId={userId}
          />
        );
        nextState = "game";
        break;
      case "end":
        title = "最終排名";
        button = "首頁";
        content = (
          <>
            <End users={users} />
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
    console.log("press");
    updateRealTime(getUrlDocumentId, { state: nextState });

    if (state === "end") {
      navigate("/");
      removeRealTime(getUrlDocumentId);
    } else {
      state === "rank" && setQNumber(qNumber);
      qNumber === qbank.questions.length - 1 &&
        state === "timeout" &&
        updateRealTime(getUrlDocumentId, { state: "end" });
    }
  }

  return (
    <WrapGame>
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
          <Question>{title}</Question>
          <WrapBtn onClick={handleState}>
            <Buttons>{button}</Buttons>
          </WrapBtn>
          {content}
        </>
      )}
    </WrapGame>
  );
};

export default HostGame;
