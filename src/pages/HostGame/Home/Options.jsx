import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";

const WrapOptions = styled.div`
  position: absolute;
  width: 99%;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;

  h3 {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    background-color: ${theme.colors.light};
  }
`;

const WrapShortAnswer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 5rem;
  left: 0;

  h3 {
    margin: 0 auto;
    max-width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10rem;
    font-size: 5rem;
    background-color: ${theme.colors.light};
  }
`;

const Correct = styled.svg`
  width: 4.4rem;
  height: 4.4rem;
  color: ${theme.colors.danger};
`;

const Options = ({ questions, answer }) => {
  return (
    <>
      {(questions.type === "mc" || questions.type === "tf") && (
        <WrapOptions>
          {questions.options.map((item, index) => {
            return (
              <h3 key={index}>
                {answer === index && (
                  <Correct
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </Correct>
                )}
                {item}
              </h3>
            );
          })}
        </WrapOptions>
      )}
      {questions.type === "sa" && (
        <WrapShortAnswer>
          {questions.options.map((item, index) => {
            return (
              <h3 key={index}>
                {answer === index && (
                  <Correct
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </Correct>
                )}
                {item}
              </h3>
            );
          })}
        </WrapShortAnswer>
      )}
    </>
  );
};

export default Options;
