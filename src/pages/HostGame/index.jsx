import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Home from "./Home";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import Options from "./Home/Options";
import Timeout from "./Timeout";
import Rank from "./Rank";
import End from "./End";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetFireStore } from "../../utils/hook/useGetFireStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";

const WrapGame = styled.div`
  width: 100%;
  height: 94vh;
  position: relative;
`;

const Question = styled.h2`
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: ${theme.colors.light};
`;

const HostGame = () => {
  const { documentId, userId, reply, setReply } = useGameStore();

  const qbank = useGetFireStore("qbank", documentId);

  const qNumber = useGetRealTime(`${documentId}/question/id`);
  const state = useGetRealTime(`${documentId}/state`);
  const users = useGetRealTime(`${documentId}/users`);
  const time = useGetRealTime(`${documentId}/time`);

  const navigate = useNavigate();

  window.onpopstate = () => {
    const confirmLeave = window.confirm("確定要離開當前頁面嗎?");
    navigate(null, "", "/host/game");
    if (confirmLeave) {
      // 如果使用者選擇取消,可以在這裡執行一些操作
      updateRealTime(documentId, { state: "home" });
      removeRealTime(documentId);
      navigate("/");
    }
  };

  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
    }

    function handleUnload(e) {
      updateRealTime(documentId, { state: "home" });
      removeRealTime(documentId);
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
              documentId={documentId}
              time={time}
            />
            <Options questions={questions} />
          </>
        );
        if (reply === Object.values(users).length)
          updateRealTime(documentId, { state: "timeout" });
        nextState = "timeout";
        break;
      case "timeout":
        title = questions.title;
        button = "排名";
        content = (
          <>
            <Timeout setReply={setReply} />
            <Options questions={questions} answer={answer} />
          </>
        );
        nextState = "rank";
        break;
      case "rank":
        title = "記分板";
        button = "下一題";
        content = (
          <Rank users={users} documentId={documentId} userId={userId} />
        );
        nextState = "game";
        break;
      case "end":
        title = "結束";
        button = "首頁";
        content = (
          <>
            <Rank users={users} />
            <End />
          </>
        );
        updateRealTime(`${documentId}/question`, { id: 0 });
        nextState = "lobby";

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
    updateRealTime(`${documentId}/question`, { id: qNumber + 1 });
  }

  function handleState() {
    updateRealTime(documentId, { state: nextState });

    if (state === "end") {
      navigate("/");
      removeRealTime(documentId);
    } else {
      state === "rank" && setQNumber(qNumber);
      qNumber === qbank.questions.length - 1 &&
        state === "timeout" &&
        updateRealTime(documentId, { state: "end" });
    }
  }

  return (
    <WrapGame>
      <Question>{title}</Question>
      <div onClick={handleState}>
        <Buttons>{button}</Buttons>
      </div>
      {content}
    </WrapGame>
  );
};

export default HostGame;
