import React from "react";
import Header from "../../components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styled from "styled-components";
import Question from "./Question";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  height: calc(100vh - 6rem);
`;

const QuestionsWrapper = styled(ScrollArea)`
  width: 30rem;
  height: 100%;
  padding: 0.5rem;
  box-shadow: inset -10px 0 6px -10px rgba(0, 0, 0, 0.2);
`;

const EditAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 3rem;
`;

const QuestionInput = styled.textarea`
  width: 100%;
  height: 5.4rem;
  border-radius: 5px;
  border: none;
  box-shadow: 0px 0px 4px 0px #33333369;
  padding: 10px;
  font-size: 28px;
  color: ${theme.colors.info};
  text-align: center;
  resize: none;
  line-height: 3rem;

  &:focus {
    outline: none;
  }
`;

const WrapAnswer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 4rem;
`;

const AnswerInput = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-between;
  padding: 1rem;
  padding-left: 2rem;

  input[type="radio"] {
    width: 4.4rem;

    color: ${theme.colors.secondary};
    accent-color: ${theme.colors.tertiary};
  }

  textarea {
    width: 100%;
    height: 5.4rem;
    border-radius: 5px;
    border: none;
    margin-left: 1rem;
    font-size: 20px;
    color: ${theme.colors.info};
    resize: none;
    line-height: 2.4rem;

    &:focus {
      outline: none;
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  width: 40rem;
  height: 20rem;
  background-color: rgb(153, 100, 132, 0.1);
  color: #333;

  border-radius: 4px;
  cursor: pointer;
  margin-top: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const RulesWrapper = styled(ScrollArea)`
  width: 30rem;
  height: 100%;
  padding: 1rem;
  text-align: left;
  box-shadow: inset 10px 0 6px -10px rgba(0, 0, 0, 0.2);
`;

const InputTitle = styled.p`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const WrapSelect = styled(Select)`
  width: 100%;
  height: 100%;
  font-size: 3rem;
`;

const WrapSelectTrigger = styled(SelectTrigger)`
  height: 5rem;

  font-size: 1.6rem;
  line-height: 2rem;
`;

const WrapSelectContent = styled(SelectContent)`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const WrapSelectItem = styled(SelectItem)`
  width: 100%;
  height: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.6rem;
  cursor: pointer;

  &:hover {
    height: 100%;
  }
`;

const SaveButton = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 2rem;
  left: 0;
  width: 100%;
`;

const Create = () => {
  return (
    <>
      <Header />
      <Wrapper>
        <QuestionsWrapper>
          <Question />
        </QuestionsWrapper>
        <EditAreaWrapper>
          <QuestionInput />
          <FileLabel htmlFor="fileInput">
            <p>輸入檔案</p>
          </FileLabel>
          <FileInput type="file" id="fileInput" accept="audio/*,image/*,.png" />
          <WrapAnswer>
            {[...Array(4)].map((_, index) => (
              <AnswerInput key={index}>
                <input
                  type="radio"
                  name="answer"
                  id={`radio${index}`}
                  value={index}
                />
                <textarea type="text" htmlFor={`radio${index}`} />
              </AnswerInput>
            ))}
          </WrapAnswer>
        </EditAreaWrapper>
        <RulesWrapper>
          <InputTitle>題型</InputTitle>
          <WrapSelect>
            <WrapSelectTrigger>
              <SelectValue placeholder="請選擇" />
            </WrapSelectTrigger>
            <WrapSelectContent>
              <WrapSelectItem value="mc">選擇題</WrapSelectItem>
              <WrapSelectItem value="tf">是非題</WrapSelectItem>
              <WrapSelectItem value="sa">簡答題</WrapSelectItem>
            </WrapSelectContent>
          </WrapSelect>
          <InputTitle>每題時間</InputTitle>
          <WrapSelect>
            <WrapSelectTrigger>
              <SelectValue placeholder="請選擇" />
            </WrapSelectTrigger>
            <WrapSelectContent>
              <WrapSelectItem value={10}>10s</WrapSelectItem>
              <WrapSelectItem value={20}>20s</WrapSelectItem>
              <WrapSelectItem value={30}>30s</WrapSelectItem>
              <WrapSelectItem value={60}>1m</WrapSelectItem>
              <WrapSelectItem value={90}>1m30s</WrapSelectItem>
              <WrapSelectItem value={120}>2m</WrapSelectItem>
              <WrapSelectItem value={180}>3m</WrapSelectItem>
            </WrapSelectContent>
          </WrapSelect>
          <SaveButton>
            <Buttons type="success">儲存</Buttons>
            <Buttons type="light">離開</Buttons>
          </SaveButton>
        </RulesWrapper>
      </Wrapper>
    </>
  );
};

export default Create;
