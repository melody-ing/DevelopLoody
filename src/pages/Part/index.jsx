import React, { useState } from "react";
import Answer from "./Answer";
import { database } from "../../utils/firebase";
import { ref, push, set } from "firebase/database";
import styled from "styled-components";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";

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
  /* background-color: ${theme.colors.light}; */
`;

const InputPin = styled.input`
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

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 3rem;
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

const Login = styled.p`
  color: ${theme.colors.secondary};
  text-decoration: underline;
  cursor: pointer;
`;

const Part = () => {
  const [isJoin, setIsJoin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  const navigation = useNavigate();

  function handlePart() {
    navigation("/part/game");
  }

  function handleJoin() {
    if (userName !== "") {
      setIsJoin(true);

      const userRef = ref(database, "users");
      const newUserRef = push(userRef);
      set(newUserRef, {
        id: newUserRef.key,
        name: userName,
        selected: "",
        score: 0,
      });
      setUserId(newUserRef.key);
    }
  }

  return (
    <WrapPart>
      <UserName>請輸入暱稱</UserName>
      <Entry>
        <InputPin placeholder="暱稱" />
        <Button onClick={handlePart} size="large">
          <p>進入</p>
        </Button>
      </Entry>
    </WrapPart>
  );
};

export default Part;
