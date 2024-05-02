import React, { useState } from "react";
import styled from "styled-components";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import { useNavigate, useParams } from "react-router-dom";
import { pushRealTime } from "../../utils/reviseRealTime";
import { Timestamp } from "firebase/firestore";
import { useGetRealTimeNavigate } from "@/utils/hook/useGetRealTime";

const WrapPart = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  margin-top: 12rem;
  font-size: xx-large;
  line-height: 7rem;
  height: 7rem;
`;

const Entry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 15rem;
  width: 30rem;
  margin-bottom: 1.2rem;
  border-radius: 10px;
`;

const InputName = styled.input`
  height: 6rem;
  width: 85%;
  border: 1px solid #ccc;
  margin-top: 2rem;
  border-radius: 10px;
  background-color: ${theme.colors.light};
  color: ${theme.colors.tertiary};
  font-size: larger;
  padding: 0 2rem;
  text-align: center;
  border: none;
  box-shadow: ${theme.shadow};

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #a9a7a7;
  }

  ${theme.breakpoints.md} {
    height: 6rem;
  }
`;

const Button = styled.button`
  background-color: ${theme.colors.dark};
  font-size: larger;
  color: ${theme.colors.light};
  margin-top: 1.6rem;
  width: 85%;
  height: 5rem;
  border-radius: 10px;
  box-shadow: ${theme.shadow};
  border: none;
  cursor: pointer;

  p {
    letter-spacing: 2rem;
    transform: translate(1rem);
  }
`;

const Part = () => {
  const [userName, setUserName] = useState("");
  const { documentId: getUrlDocumentId } = useParams();

  const {
    data: realTimeData,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTimeNavigate("/", "/");

  const navigate = useNavigate();

  function handleJoin() {
    if (userName !== "") {
      const userId = pushRealTime(`${getUrlDocumentId}/users`, {
        addScore: 0,
        name: userName,
        score: 0,
        time: Timestamp.now(),
      });
      localStorage.setItem("userId", userId);
      navigate(`/part/game/${getUrlDocumentId}`);
    }
  }

  return (
    <WrapPart>
      <UserName>請輸入暱稱</UserName>
      <Entry>
        <InputName
          placeholder="暱稱"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button onClick={handleJoin} size="large">
          <p>進入</p>
        </Button>
      </Entry>
    </WrapPart>
  );
};

export default Part;
