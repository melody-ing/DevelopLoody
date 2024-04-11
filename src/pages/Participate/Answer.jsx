import React, { useState } from "react";
import { set, ref, update } from "firebase/database";
import { database } from "../../utils/firebase";
import styled from "styled-components";

const Part = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 1vh;
  gap: 10px;

  button {
    width: 100%;
    height: 200px;
    outline: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    background-color: #9c9b9b;
    border-radius: 5px;
    padding: 10px;
  }
`;

const Answer = ({ userId }) => {
  const [isAnswer, setIsAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  function handleAnswer(e) {
    update(ref(database, "users/" + userId), {
      selected: e.target.value,
      score: 100,
    });
    setIsCorrect(e.target.value === "C" ? true : false);
    setIsAnswer(true);
  }

  return isAnswer ? (
    isCorrect ? (
      "Correct！"
    ) : (
      "incorrect！"
    )
  ) : (
    <Part>
      <button onClick={handleAnswer} value="A">
        A
      </button>
      <button onClick={handleAnswer} value="B">
        B
      </button>
      <button onClick={handleAnswer} value="C">
        C
      </button>
      <button onClick={handleAnswer} value="D">
        D
      </button>
    </Part>
  );
};

export default Answer;
