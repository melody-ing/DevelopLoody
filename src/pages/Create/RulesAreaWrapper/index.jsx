import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styled from "styled-components";
import theme from "@/components/css/theme";
import { useNavigate } from "react-router-dom";
import { setFireStore } from "@/utils/reviseFireStore";
import { serverTimestamp } from "firebase/firestore";
import { Slide, toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Buttons from "@/components/Buttons";

const WrapRulesAreaWrapper = styled(ScrollArea)`
  width: 40rem;
  height: 100%;
  padding: 1rem;
  text-align: left;
  box-shadow: inset 10px 0 6px -10px rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.dark};
  ${theme.breakpoints.sm} {
    width: 100%;
    height: 45rem;
    box-shadow: 0px -2px 4px 0px #3333333b;
  }
`;

const InputTitle = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: ${theme.colors.light};
  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const WrapQBankNameInput = styled.div`
  position: relative;
  ${theme.breakpoints.sm} {
    position: absolute;
    bottom: 2rem;
    left: 1rem;
    width: 100%;
  }
`;

const WrapSelected = styled.div`
  ${theme.breakpoints.sm} {
    position: absolute;
    width: 95%;
    bottom: 8rem;
    left: 1rem;
    display: flex;
    gap: 1rem;
  }
`;

const QBankNameInput = styled(TextField)`
  width: 100%;
  outline: none;
  border: none;

  & .MuiOutlinedInput-root {
    font-size: 1.8rem;
    width: 100%;
    background-color: #fff;
  }

  & .MuiOutlinedInput-input {
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }

  ${theme.breakpoints.sm} {
    width: 70%;

    & .MuiOutlinedInput-root {
      font-size: 1.6rem;
      width: 100%;
    }

    & .MuiOutlinedInput-input {
      height: 1.6rem;
    }

    & .MuiFormLabel-root {
      font-size: 1.4rem;
    }
  }
`;

const WrapSelect = styled(Select)`
  width: 100%;
  height: 100%;
  font-size: 3rem;
`;

const WrapSelectTrigger = styled(SelectTrigger)`
  height: 4rem;
  background-color: #4c4c4c;
  color: ${theme.colors.light};
  outline: none;
  border: none;
  font-size: 1.6rem;
  line-height: 2rem;

  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
  }
`;

const WrapSelectContent = styled(SelectContent)`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: #4c4c4c;
  color: ${theme.colors.light};
  outline: none;
  border: none;

  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
    width: auto;
  }
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
  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
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

  ${theme.breakpoints.sm} {
    right: 1rem;
    left: auto;
    width: auto;
    bottom: 2.6rem;
  }
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const QbankNameTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 0.6rem;
  top: 3.6rem;
  font-size: 1.4rem;
`;

const RulesAreaWrapper = ({
  setQBankName,
  getQbankData,
  handleIsChange,
  setQuestionType,
  editNum,
  setInputOptions,
  getUrlDocumentId,
  setTimeLimit,
  setIsDone,
  isQBankNameFill,
  qBankName,
  questionType,
  timeLimit,
}) => {
  const navigate = useNavigate();
  function handleQBankName(e) {
    setQBankName(e.target.value.slice(0, 40));
    getQbankData.name = e.target.value.slice(0, 40);
    handleIsChange();
  }

  function handleQuestionType(e) {
    setQuestionType(e);
    getQbankData.questions[editNum].type = e;

    if (e === "mc") {
      getQbankData.questions[editNum].options = ["", "", "", ""];
      getQbankData.questions[editNum].answer = 0;
      setInputOptions(["", "", "", ""]);
    }
    if (e === "tf") {
      getQbankData.questions[editNum].options = ["是", "否"];
      getQbankData.questions[editNum].answer = 0;

      setInputOptions(["是", "否"]);
    }
    if (e === "sa") {
      getQbankData.questions[editNum].options = [""];
      setInputOptions([""]);
    }

    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleTimeLimit(e) {
    setTimeLimit(e);
    getQbankData.questions[editNum].timeLimit = e;
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleComplete() {
    setIsDone();
    getQbankData.questions.forEach((question) => {
      if (
        question.type === "sa" &&
        question.answer !== "" &&
        question.options[0] !== ""
      ) {
        question.answer = question.answer.trim();
        question.options[0] = question.options[0].trim();
      }
    });
    const allIsDone = getQbankData.questions.every(
      (question) => question.isDone === true
    );
    if (allIsDone && isQBankNameFill) {
      getQbankData.isDone = true;
    } else {
      getQbankData.isDone = false;
    }

    toast.warn("編輯完成");
    getQbankData.editTime = serverTimestamp();
    setFireStore("qbank", getUrlDocumentId, getQbankData);
    navigate(`/dashboard`);
  }

  return (
    <WrapRulesAreaWrapper>
      <InputTitle>題庫名稱</InputTitle>
      <WrapQBankNameInput>
        <QBankNameInput
          value={qBankName}
          onChange={handleQBankName}
          error={!isQBankNameFill}
          label={isQBankNameFill ? null : "請輸入題庫名稱"}
        />
        <QbankNameTextWarning>
          {qBankName ? qBankName.length : 0}/40
        </QbankNameTextWarning>
      </WrapQBankNameInput>
      <WrapSelected>
        <InputTitle>題型</InputTitle>
        <WrapSelect value={questionType} onValueChange={handleQuestionType}>
          <WrapSelectTrigger className="focus:ring-0">
            <SelectValue placeholder="請選擇" />
          </WrapSelectTrigger>
          <WrapSelectContent>
            <WrapSelectItem value="mc">選擇題</WrapSelectItem>
            <WrapSelectItem value="tf">是非題</WrapSelectItem>
            <WrapSelectItem value="sa">簡答題</WrapSelectItem>
          </WrapSelectContent>
        </WrapSelect>

        <InputTitle>每題時間</InputTitle>
        <WrapSelect value={timeLimit} onValueChange={handleTimeLimit}>
          <WrapSelectTrigger className="focus:ring-0">
            <SelectValue placeholder="請選擇" />
          </WrapSelectTrigger>
          <WrapSelectContent>
            <WrapSelectItem value={10}>10秒</WrapSelectItem>
            <WrapSelectItem value={20}>20秒</WrapSelectItem>
            <WrapSelectItem value={30}>30秒</WrapSelectItem>
            <WrapSelectItem value={60}>1分鐘</WrapSelectItem>
            <WrapSelectItem value={90}>1分鐘30秒</WrapSelectItem>
            <WrapSelectItem value={120}>2分鐘</WrapSelectItem>
            <WrapSelectItem value={180}>3分鐘</WrapSelectItem>
          </WrapSelectContent>
        </WrapSelect>
      </WrapSelected>

      <SaveButton>
        <Buttons onClick={handleComplete} type="success">
          完成
        </Buttons>
      </SaveButton>
    </WrapRulesAreaWrapper>
  );
};

export default RulesAreaWrapper;
