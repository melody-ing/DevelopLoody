import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";

const WrapOptions = styled.div`
  position: absolute;
  width: 99%;
  bottom: 4rem;
  left: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;

  h3 {
    cursor: pointer;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    background-color: ${theme.colors.light};
  }

  ${theme.breakpoints.sm} {
    width: 100vw;
    height: 96vh;
    top: 0;

    padding: 2rem;

    h3 {
      height: 100%;
    }
  }
`;

const Correct = styled.svg`
  width: 4.4rem;
  height: 4.4rem;
  color: ${theme.colors.danger};
`;

const Options = ({ questions, answer }) => {
  return (
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
  );
};

export default Options;
