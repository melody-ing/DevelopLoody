import React, { PureComponent, useEffect } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = [
  `#808F7C`,
  `#63735e`,
  `#63735e`,
  `#deca72`,
  `#bca74b`,
  `#bca74b`,
];

class CustomizedContent extends PureComponent {
  render() {
    const {
      root,
      depth,
      x,
      y,
      width,
      height,
      index,
      payload,
      colors,
      rank,
      name,
      usersAnswer,
    } = this.props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? colors[Math.floor((index / root.children?.length) * 6)]
                : "#ffffff00",
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 24}
            textAnchor="middle"
            fill="#fff"
            fontSize={60}
          >
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text
            x={x + 10}
            y={y + 36}
            fill="#fff"
            fontSize={30}
            fillOpacity={0.9}
          >
            {usersAnswer[index]}
          </text>
        ) : null}
      </g>
    );
  }
}

const WrapTimeout = styled.div`
  width: 60%;
  height: 50%;
  margin: 3rem auto;
  display: flex;
  justify-content: center;
`;

const WrapShortAnswers = styled(ScrollArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 32rem);
`;

const WrapShortAnswer = styled.div`
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 6.5rem;
  ${({ $isCorrect }) => $isCorrect && `background-color: #fbeb8f`};

  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;
  background-color: #fff;
`;

const Timeout = ({ users, qbank, qNumber, questions, audioRef }) => {
  const qType = qbank.questions[qNumber].type;

  const peopleNum = (ans) =>
    users &&
    Object.values(users).filter((user) => user.selected === ans).length;

  const data = [];

  const answers = { mc: ["A", "B", "C", "D"], tf: ["T", "F"] };

  const usersAnswer = [];

  if (questions?.type === "mc" || questions?.type === "tf") {
    answers[qType].forEach((ans, index) => {
      peopleNum(index) &&
        data.push({
          name: peopleNum(index),
          // size: (index + 1) * 2,
          size: peopleNum(index),
        }) &&
        usersAnswer.push(answers[qType][index]);
    });
  }

  return (
    <WrapTimeout>
      {(questions?.type === "mc" || questions?.type === "tf") && (
        <ResponsiveContainer width="60%" height="100%">
          <Treemap
            width={400}
            height={200}
            data={data}
            dataKey="size"
            stroke="#fff"
            fill="#8884d8"
            content={
              <CustomizedContent colors={COLORS} usersAnswer={usersAnswer} />
            }
          />
        </ResponsiveContainer>
      )}
      {questions?.type === "sa" && (
        <WrapShortAnswers>
          {Object.values(users)
            .sort((a, b) => b.addScore - a.addScore)
            .map(
              (user, index) =>
                user.selected === questions.answer && (
                  <WrapShortAnswer $isCorrect={true} key={index}>
                    <div>{user.name}</div>
                    <div>{user.selected}</div>
                    <div>{user.addScore}</div>
                  </WrapShortAnswer>
                )
            )}
          {Object.values(users).map(
            (user, index) =>
              user.selected !== questions.answer && (
                <WrapShortAnswer $isCorrect={false} key={index}>
                  <div>{user.name}</div>
                  <div>{user.selected}</div>
                  <div>{user.addScore}</div>
                </WrapShortAnswer>
              )
          )}
        </WrapShortAnswers>
      )}
      <audio autoPlay src="/bgm/timeout.mp3" ref={audioRef} />
    </WrapTimeout>
  );
};

export default Timeout;
