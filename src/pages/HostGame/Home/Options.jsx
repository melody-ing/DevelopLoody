import React from "react";
import styled from "styled-components";
import theme from "../../../components/css/theme";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapOptions = styled.div`
  width: 80%;

  display: grid;
  grid-template-columns: 50% 50%;
  gap: 20px;

  h3 {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
    font-size: 3rem;
    background-color: #f6efe0;
    border-radius: 5px;
    box-shadow: 0px 6px 0px 0 #7e6b3f;
  }
`;

const WrapShortAnswer = styled.div`
  width: 100%;

  h3 {
    margin: 0 auto;
    max-width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10rem;
    font-size: 5rem;
    background-color: #f6efe0;
    border-radius: 5px;
    box-shadow: 0px 8px 0px 0 #7e6b3f;
  }
`;

const Correct = styled.svg`
  width: 4.4rem;
  height: 4.4rem;
  color: ${theme.colors.danger};
`;

const Options = ({ questions, answer, state }) => {
  return (
    <Wrapper>
      {state === "game" &&
        (questions.type === "mc" || questions.type === "tf") && (
          <WrapOptions>
            {questions.options.map((item, index) => {
              return <h3 key={index}>{item}</h3>;
            })}
          </WrapOptions>
        )}
      {state === "timeout" &&
        (questions.type === "mc" || questions.type === "tf") && (
          <WrapOptions>
            {questions.options.map((item, index) => {
              return (
                <h3
                  key={index}
                  style={
                    answer === index
                      ? {
                          backgroundColor: "#fff384",
                          boxShadow: "0px 6px 0px 0 #7e6b3f",
                        }
                      : {
                          backgroundColor: "#eee",
                          boxShadow: "none",
                        }
                  }
                >
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
    </Wrapper>
  );
};

export default Options;
