import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "@/components/css/theme";
import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { useParams } from "react-router-dom";
import { setFireStore } from "@/utils/reviseFireStore";
import ReactLoading from "react-loading";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import { auth } from "@/utils/firebase";
import QuestionsAreaWrapper from "./QuestionsAreaWrapper";
import EditAreaWrapper from "./EditAreaWrapper";
import RulesAreaWrapper from "./RulesAreaWrapper";

const Wrapper = styled.div`
  max-height: 100vh;
  width: 100%;
  display: flex;
  height: 100vh;

  ${theme.breakpoints.sm} {
    flex-direction: column;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const Create = () => {
  const user = auth.currentUser;
  let uid = null;
  if (user) {
    uid = user.uid;
  }

  const { documentId: getUrlDocumentId } = useParams();
  const {
    data: getQbankData,
    // isError: getQbankIsError,
    isLoading: getQbankIsLoading,
  } = useGetFireStore("qbank", getUrlDocumentId);
  const {
    data: getQbanksData,
    // isError: qbanksIsError,
    // isLoading: qbanksIsLoading,
  } = useGetFireStores(`users/${uid}/qbanks`);
  const [editNum, setEditNum] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const question = getQbankData?.questions[editNum];
  const [answerRadio, setAnswerRadio] = useState(0);
  const [questionType, setQuestionType] = useState("");
  const [timeLimit, setTimeLimit] = useState(null);
  const [stateQuestions, setStateQuestions] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");
  const [inputOptions, setInputOptions] = useState(["", "", "", ""]);
  const [qBankName, setQBankName] = useState("");
  const [isTitleFill, setIsTitleFill] = useState(true);
  const [isOptionsFill, setIsOptionsFill] = useState([true, true, true, true]);
  const [isQBankNameFill, setIsQBankNameFill] = useState(true);

  useOnAuthStateChange();

  useEffect(() => {
    if (!getQbanksData) return;
    const isGetQbankShared = getQbanksData.some(
      (qBank) => qBank.id === getUrlDocumentId
    );
    if (!isGetQbankShared) {
      setFireStore(`users/${uid}/qbanks`, getUrlDocumentId, {
        id: getUrlDocumentId,
      });
    }
  }, [getQbanksData]);

  useEffect(() => {
    if (isChanging === true) return;
    if (getQbankData) setFireStore("qbank", getUrlDocumentId, getQbankData);
  }, [isChanging]);

  function handleIsChange() {
    setIsChanging(true);
    const setInputTimeout = setTimeout(() => {
      setIsChanging(false);
    }, 5000);
    return () => {
      clearTimeout(setInputTimeout);
    };
  }

  useEffect(() => {
    if (isChanging === true) return;
    if (getQbankData) {
      setStateQuestions(getQbankData.questions);
      setQBankName(getQbankData.name);
    }

    if (question) {
      setAnswerRadio(question.answer);
      setQuestionType(question.type);
      setTimeLimit(question.timeLimit);
      setMediaUrl(question.media);
      setTitle(question.title);
      setInputOptions(question.options);
    }
  }, [getQbankData, editNum]);

  function setIsDone() {
    const isOptionsIncomplete = inputOptions.some((option) => option === "");
    if (!title || isOptionsIncomplete) {
      getQbankData.questions[editNum].isDone = false;
      setFireStore("qbank", getUrlDocumentId, getQbankData);
    } else {
      getQbankData.questions[editNum].isDone = true;
      setFireStore("qbank", getUrlDocumentId, getQbankData);
    }
  }

  useEffect(() => {
    if (question?.isDone === undefined) {
      setIsTitleFill(true);
      setIsOptionsFill([true, true, true, true]);
      return;
    }
    title ? setIsTitleFill(true) : setIsTitleFill(false);
    qBankName ? setIsQBankNameFill(true) : setIsQBankNameFill(false);
    const newIsOptionsFill = inputOptions.map((option) => option !== "");
    setIsOptionsFill(newIsOptionsFill);
  }, [title, inputOptions, qBankName]);

  return (
    getQbankData && (
      <>
        {getQbankIsLoading ? (
          <Loading>
            <ReactLoading
              type="bars"
              color={theme.colors.primary}
              height={100}
              width={100}
            />
          </Loading>
        ) : (
          <Wrapper>
            <QuestionsAreaWrapper
              getQbankData={getQbankData}
              setIsDone={setIsDone}
              setEditNum={setEditNum}
              setTitle={setTitle}
              setInputOptions={setInputOptions}
              setQuestionType={setQuestionType}
              setTimeLimit={setTimeLimit}
              setStateQuestions={setStateQuestions}
              getUrlDocumentId={getUrlDocumentId}
              editNum={editNum}
              stateQuestions={stateQuestions}
            />
            <EditAreaWrapper
              setTitle={setTitle}
              getQbankData={getQbankData}
              editNum={editNum}
              handleIsChange={handleIsChange}
              question={question}
              setAnswerRadio={setAnswerRadio}
              questionType={questionType}
              setInputOptions={setInputOptions}
              setMediaUrl={setMediaUrl}
              isTitleFill={isTitleFill}
              title={title}
              mediaUrl={mediaUrl}
              isOptionsFill={isOptionsFill}
              inputOptions={inputOptions}
              answerRadio={answerRadio}
              getUrlDocumentId={getUrlDocumentId}
            />
            <RulesAreaWrapper
              setQBankName={setQBankName}
              getQbankData={getQbankData}
              handleIsChange={handleIsChange}
              setQuestionType={setQuestionType}
              editNum={editNum}
              setInputOptions={setInputOptions}
              getUrlDocumentId={getUrlDocumentId}
              setTimeLimit={setTimeLimit}
              setIsDone={setIsDone}
              isQBankNameFill={isQBankNameFill}
              qBankName={qBankName}
              questionType={questionType}
              timeLimit={timeLimit}
            />
          </Wrapper>
        )}
      </>
    )
  );
};

export default Create;
