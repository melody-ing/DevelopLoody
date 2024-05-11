import React, { PureComponent, useEffect, useState } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import theme from "../../../components/css/theme";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

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
  width: 77%;
  height: 50%;
  margin: 2rem auto;
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
  margin: 1rem auto;
  display: grid;
  text-align: left;
  width: 100%;
  height: 6.5rem;
  grid-template-columns: 25rem 1fr;

  ${({ $isCorrect }) =>
    $isCorrect ? `background-color: #fbeb8f` : `background-color: #fff`};

  font-size: 3rem;
  box-shadow: ${theme.shadow};
  padding: 2rem;
  border-radius: 10px;

  ${theme.breakpoints.sm} {
    grid-template-columns: 18rem 1fr;
  }
`;

const WrapMedia = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  z-index: 100;
  position: absolute;

  img {
    max-height: calc(100vh - 40rem);
    object-fit: contain;
  }

  ${theme.breakpoints.sm} {
    position: absolute;
    left: calc(100vw - 45rem);

    img {
      max-height: 40rem;
      object-fit: contain;
    }
  }
`;

const WrapGraph = styled(ResponsiveContainer)``;

const Timeout = ({ qbank, qNumber, questions, audioRef, arrayUsers }) => {
  const qType = qbank.questions[qNumber].type;
  const [nameLength, setNameLength] = useState(null);
  const [answerLength, setAnswerLength] = useState(null);

  const peopleNum = (ans) =>
    arrayUsers && arrayUsers.filter((user) => user.selected === ans).length;

  const data = [];

  const answers = { mc: ["A", "B", "C", "D"], tf: ["T", "F"] };

  const usersAnswer = [];

  if (questions?.type === "mc" || questions?.type === "tf") {
    answers[qType].forEach((ans, index) => {
      peopleNum(index) &&
        data.push({
          name: peopleNum(index),
          size: peopleNum(index),
        }) &&
        usersAnswer.push(answers[qType][index]);
    });
  }

  const calculateNameLength = () => {
    if (window.innerWidth < 500) {
      return 1;
    } else if (window.innerWidth < 940) {
      return 3;
    } else if (window.innerWidth < 1280) {
      return 6;
    }
    return 6;
  };

  const calculateAnswerLength = () => {
    if (window.innerWidth < 520) {
      return 3;
    } else if (window.innerWidth < 940) {
      return 5;
    } else if (window.innerWidth < 1280) {
      return 13;
    }
    return 22;
  };

  const handleResize = () => {
    setNameLength(calculateNameLength());
    setAnswerLength(calculateAnswerLength());
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    const media = document.querySelector(".media");
    const graph = document.querySelector(".graph");
    const mediaWidth = media?.offsetWidth;
    const graphWidth = graph?.offsetWidth;
    if (mediaWidth) {
      gsap.to(".media", {
        x: -mediaWidth / 1.9,
        duration: 2,
      });

      gsap.to(".graph", {
        x: graphWidth / 1.9,
        duration: 2,
      });
    }
  });

  return (
    <WrapTimeout>
      {(questions?.type === "mc" || questions?.type === "tf") && (
        <>
          <WrapMedia className="media">
            <img src={questions.media} alt="" />
          </WrapMedia>

          <WrapGraph className="graph" width="50%" height="72%">
            <Treemap
              width={400}
              height={200}
              data={data}
              dataKey="size"
              fill="#8884d8"
              content={
                <CustomizedContent colors={COLORS} usersAnswer={usersAnswer} />
              }
            />
          </WrapGraph>
        </>
      )}
      {questions?.type === "sa" && (
        <WrapShortAnswers>
          {arrayUsers
            .sort((a, b) => b.addScore - a.addScore)
            .map(
              (user, index) =>
                user.selected === questions.answer && (
                  <WrapShortAnswer $isCorrect={true} key={index}>
                    <div>
                      {user.name.length <= 6
                        ? user.name
                        : user.name.slice(0, nameLength) + "..."}
                    </div>
                    <div>
                      {user.selected
                        ? user.selected.length <= answerLength
                          ? user.selected
                          : user.selected.slice(0, answerLength) + "..."
                        : ""}
                    </div>
                  </WrapShortAnswer>
                )
            )}
          {arrayUsers.map(
            (user, index) =>
              user.selected !== questions.answer &&
              user.selected !== "" &&
              user.selected !== undefined && (
                <WrapShortAnswer $isCorrect={false} key={index}>
                  <div>
                    {user.name.length <= 6
                      ? user.name
                      : user.name.slice(0, nameLength) + "..."}
                  </div>
                  <div>
                    {user.selected
                      ? user.selected.length <= answerLength
                        ? user.selected
                        : user.selected.slice(0, answerLength) + "..."
                      : ""}
                  </div>
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
