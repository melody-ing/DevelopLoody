import Buttons from "@/components/Buttons";
import theme from "@/components/css/theme";
import { updateRealTime } from "@/utils/reviseRealTime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WrapQBankButtons = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const HoverHost = styled.div`
  color: ${theme.colors.info};
  background-color: #ffffff;
  border: 2px solid #ececec;
  position: absolute;
  left: 8.8rem;
  width: 10rem;
  top: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 5px;
  font-size: 1.4rem;
`;

const HostButton = ({ item }) => {
  const [isHostHover, setIsHostHover] = useState(false);

  const navigate = useNavigate();
  function handleEdit(id) {
    navigate(`/create/${id}`);
  }

  function handleHost(id) {
    const pin = Math.floor(Math.random() * 900000) + 100000;

    updateRealTime(id, {
      id,
      pin: pin.toString(),
      question: { answer: 1, id: 0 },
      state: "lobby",
      users: {},
    });
    navigate(`/host/${id}/${pin}`);
  }
  return (
    <WrapQBankButtons>
      <Buttons onClick={() => handleEdit(item.id)} type="light" size="small">
        編輯
      </Buttons>
      <div
        onClick={() => item.isDone && handleHost(item.id)}
        onMouseEnter={() => setIsHostHover(true)}
        onMouseLeave={() => setIsHostHover(false)}
      >
        <Buttons type={item.isDone ? "success" : "invalid"} size="small">
          主持
        </Buttons>
      </div>
      {!item.isDone && isHostHover && <HoverHost>尚未編輯完成</HoverHost>}
    </WrapQBankButtons>
  );
};

export default HostButton;
