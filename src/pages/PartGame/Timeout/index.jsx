import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 12rem;
  left: 50%;
  transform: translate(-50%);
`;

const Result = styled.svg`
  width: 10rem;
  height: 10rem;
`;

const ResultWord = styled.div`
  color: #a78d50;
  font-size: 2rem;
`;

const Timeout = ({ user, answer }) => {
  return (
    <Wrapper>
      <div>
        {user.selected === answer ? (
          <Result
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            style={{ color: `#718567` }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </Result>
        ) : (
          <>
            <Result
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              style={{ color: `#91453d` }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </Result>
          </>
        )}
      </div>
      <ResultWord>
        {user.selected === answer ? `+${user.addScore}` : "答錯囉"}
      </ResultWord>
    </Wrapper>
  );
};

export default Timeout;
