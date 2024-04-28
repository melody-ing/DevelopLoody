import React, { useEffect, useRef, useState } from "react";

import Header from "../../components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import styled from "styled-components";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";
import Clone from "./Clone";
import Delete from "./Delete";

import { useGetFireStore } from "@/utils/hook/useGetFireStore";
import { useNavigate, useParams } from "react-router-dom";
import { setFireStore } from "@/utils/reviseFireStore";
import { serverTimestamp } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Slide, toast } from "react-toastify";
import ReactLoading from "react-loading";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";

const QBankNameInput = styled(TextField)`
  width: 100%;
  outline: none;
  border: none;

  & .MuiOutlinedInput-root {
    font-size: 2rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  height: calc(100vh - 6rem);
`;

const QuestionsPositions = styled.div`
  position: relative;
  width: 40rem;
  height: 100%;
`;

const QuestionsWrapper = styled(ScrollArea)`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  box-shadow: inset -10px 0 6px -10px rgba(0, 0, 0, 0.2);
  position: relative;
  padding-bottom: 7rem;
`;

const WrapButton = styled.div`
  width: 100%;
  z-index: 100;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, 0);
`;

const DropImg = styled.img`
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;
`;

const SingleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapWrapQuestion = styled.div`
  width: 24.9rem;
  padding: 0.6rem 0rem;
  padding-left: 0.5rem;
`;

const WrapQuestion = styled.div`
  background-color: ${({ $editNum }) => $editNum && "rgb(227, 227, 227)"};

  width: 96%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;

  text-align: left;
  box-shadow: 0px 0px 4px 0px #33333369;
  ${({ $isDone }) =>
    $isDone === false && `border : 1.2px solid ${theme.colors.danger}`};
  padding: 5px;
  border-radius: 5px;

  img {
    margin-top: 0.4rem;
    width: 4rem;
    height: 4rem;
  }
`;

const FlexTop = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
`;

const Title = styled.div`
  font-size: 16px;
  width: 73%;
  overflow-wrap: break-word;
`;

const Information = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

const QuestionInput = styled(TextField)`
  width: 96%;

  & .MuiOutlinedInput-root {
    box-shadow: 0px 0px 4px 0px #33333369;
    font-size: 2.6rem;
    width: 100%;
    margin-top: 2rem;
  }

  & .MuiOutlinedInput-input {
    text-align: center;
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
    margin-top: 2rem;
  }
`;

const WrapAnswer = styled.div`
  width: 94%;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 2rem;
  margin-top: 4rem;
  position: absolute;
  bottom: 2rem;
`;

const WrapAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;

  input[type="radio"] {
    width: 4.4rem;

    color: ${theme.colors.secondary};
    accent-color: ${theme.colors.tertiary};
  }
`;

const TextAreaInput = styled(TextField)`
  & .MuiOutlinedInput-root {
    font-size: 2.6rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
    margin-top: 0.6rem;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const WrapShortAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};

  width: 80%;
  height: 10rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  position: absolute;
  bottom: 10rem;
`;

const ShortAnswerInput = styled(TextField)`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;

  & .MuiOutlinedInput-root {
    font-size: 2.6rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
    text-align: center;
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
    margin-top: 0.6rem;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const TextAreaWrapper = styled.div`
  width: 100%;
  max-width: 34rem;
  height: 5.4rem;
  font-size: 20px;
  color: ${theme.colors.info};
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 1rem;
  max-width: 70rem;
  height: auto;
  border: 2px solid #ccc;
  color: #333;
  position: relative;

  border-radius: 4px;
  cursor: pointer;
  margin-top: 2.4rem;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: calc(100vh - 47rem);
    max-width: calc(100vw - 50rem);

    object-fit: contain;
  }
`;

const InputMediaDelete = styled.div`
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  border-radius: 5px;
  background-color: #ffffffb5;
`;

const RulesWrapper = styled(ScrollArea)`
  width: 40rem;
  height: 100%;
  padding: 1rem;
  text-align: left;
  box-shadow: inset 10px 0 6px -10px rgba(0, 0, 0, 0.2);
`;

const InputTitle = styled.div`
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
const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const Create = () => {
  const navigate = useNavigate();
  const { documentId: getUrlDocumentId, UserId: getUrlUserId } = useParams();
  const {
    data: getQbankData,
    isError,
    isLoading,
  } = useGetFireStore("qbank", getUrlDocumentId);
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

  const onDragEnd = (event) => {
    const { source, destination } = event;

    if (!destination) {
      return;
    }

    let newItems = [...stateQuestions];
    const [remove] = newItems.splice(source.index, 1);

    newItems.splice(destination.index, 0, remove);

    setStateQuestions(newItems);
    getQbankData.questions = newItems;
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  };

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

  function handlePickQuestion(index) {
    setIsDone();
    setEditNum(index);
    setTitle(getQbankData.questions[index].title);
    setInputOptions(getQbankData.questions[index].options);
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

  function handleTitleInput(e) {
    setTitle(e.target.value);
    getQbankData.questions[editNum].title = e.target.value;
    handleIsChange();
  }

  function handleAnswerRadio(e) {
    if (question.type === "mc" || question.type === "tf") {
      setAnswerRadio(+e.target.value);
      getQbankData.questions[editNum].answer = +e.target.value;
    }
    if (question.type === "sa") {
      setAnswerRadio(e.target.value);
      getQbankData.questions[editNum].answer = e.target.value;
    }
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleAnswerInput(e, index) {
    setInputOptions((inputOptions) => {
      const newArray = [...inputOptions];
      newArray[index] = e.target.value;
      return newArray;
    });
    getQbankData.questions[editNum].options[index] = e.target.value;
    handleIsChange();
  }

  function handleQBankName(e) {
    setQBankName(e.target.value);
    getQbankData.name = e.target.value;
    handleIsChange();
  }

  function handleQuestionType(e) {
    setQuestionType(e);
    getQbankData.questions[editNum].type = e;

    if (e === "mc")
      getQbankData.questions[editNum].inputOptions = ["", "", "", ""];
    if (e === "tf") getQbankData.questions[editNum].inputOptions = ["是", "否"];
    if (e === "sa") getQbankData.questions[editNum].inputOptions = [""];

    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleTimeLimit(e) {
    setTimeLimit(e);
    getQbankData.questions[editNum].timeLimit = e;
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleAddQuestion(type) {
    setIsDone();

    setEditNum(getQbankData.questions.length);
    let options = [];
    switch (type) {
      case "mc":
        options = ["", "", "", ""];
        break;
      case "tf":
        options = ["是", "否"];
        break;
      case "sa":
        options = [""];
        break;
    }

    getQbankData.questions.push({
      answer: 0,
      id: uuidv4(),
      media: "",
      options,
      timeLimit: 10,
      title: "",
      type,
    });
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleClone(index, e) {
    e.stopPropagation();
    const originalQuestion = getQbankData.questions[index];
    const newQuestion = JSON.parse(JSON.stringify(originalQuestion));
    newQuestion.id = uuidv4();
    getQbankData.questions.splice(index, 0, newQuestion);
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleDelete(index, e) {
    if (getQbankData.questions.length === 1) {
      return;
    }
    e.stopPropagation();
    if (index === editNum) {
      setEditNum(index - 1);
    } else if (editNum >= getQbankData.questions.length - 1) {
      setEditNum(editNum - 1);
    }
    getQbankData.questions.splice(index, 1);
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleFileInput(e) {
    if (e) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];

      if (
        validImageTypes.includes(fileType) ||
        validVideoTypes.includes(fileType) ||
        validAudioTypes.includes(fileType)
      ) {
        const storage = getStorage();
        const imagesRef = ref(storage, `${serverTimestamp()}`);
        uploadBytes(imagesRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setMediaUrl(url);
                getQbankData.questions[editNum].media = url;
                setFireStore("qbank", getUrlDocumentId, getQbankData);
              })
              .catch((error) => {
                console.log(error.message);
              });
          })
          .catch((error) => {
            console.log(error.message);
          });

        return;
      }
      alert("無效的檔案");
    }
  }

  function handleDeleteMedia(e) {
    setMediaUrl("");
    getQbankData.questions[editNum].media = "";
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }

  function handleComplete() {
    setIsDone();
    const allIsDone = getQbankData.questions.every(
      (question) => question.isDone === true
    );
    if (allIsDone && isQBankNameFill) {
      getQbankData.isDone = true;
    } else {
      getQbankData.isDone = false;
    }

    toast.warn("編輯完成", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      icon: false,
      transition: Slide,
    });
    getQbankData.editTime = serverTimestamp();
    setFireStore("qbank", getUrlDocumentId, getQbankData);
    navigate(`/dashboard`);
  }

  return (
    getQbankData && (
      <>
        <Header />
        {isLoading ? (
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
            <QuestionsPositions>
              <WrapButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="outline-none">
                    <SingleButton>
                      <Buttons>新增</Buttons>
                    </SingleButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-4">
                    <DropdownMenuLabel className="text-2xl ">
                      題目種類
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      { name: "單選題", id: "mc" },
                      { name: "是非題", id: "tf" },
                      { name: "簡答題", id: "sa" },
                    ].map((item, index) => {
                      return (
                        <DropdownMenuItem
                          key={index}
                          onClick={(e) => handleAddQuestion(item.id)}
                          className="text-3xl pr-44 py-5 cursor-pointer"
                        >
                          <DropImg src={`/icon/${item.id}.png`} alt="" />
                          {item.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </WrapButton>
              <QuestionsWrapper>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="123">
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {stateQuestions?.map((question, index) => (
                          <div key={question.id}>
                            <Draggable
                              key={question.id}
                              draggableId={`${question.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    <WrapWrapQuestion>
                                      <WrapQuestion
                                        key={question.id}
                                        $editNum={editNum === index}
                                        onClick={() =>
                                          handlePickQuestion(index)
                                        }
                                        $isDone={question.isDone}
                                      >
                                        <FlexTop>
                                          <img
                                            src={`/icon/${question.type}.png`}
                                            alt=""
                                          />
                                          <Title>
                                            {question.title.slice(0, 18) +
                                              `${
                                                question.title.length > 16
                                                  ? "..."
                                                  : ""
                                              }`}
                                          </Title>
                                        </FlexTop>
                                        <Information>
                                          <div
                                            onClick={(e) =>
                                              handleClone(index, e)
                                            }
                                          >
                                            <Clone />
                                          </div>
                                          <p>{index + 1}</p>
                                          <div
                                            onClick={(e) =>
                                              handleDelete(index, e)
                                            }
                                          >
                                            <Delete />
                                          </div>
                                        </Information>
                                      </WrapQuestion>
                                    </WrapWrapQuestion>
                                  }
                                </div>
                              )}
                            </Draggable>
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </QuestionsWrapper>
            </QuestionsPositions>
            <EditAreaWrapper>
              <QuestionInput
                error={!isTitleFill}
                id="outlined-error"
                label={isTitleFill ? null : "尚未輸入"}
                value={title}
                onChange={handleTitleInput}
              />
              <FileLabel htmlFor="fileInput">
                {mediaUrl === "" ? (
                  <p>輸入圖片</p>
                ) : (
                  <>
                    <img src={mediaUrl} />
                    <InputMediaDelete onClick={handleDeleteMedia}>
                      <Delete size={4.4} />
                    </InputMediaDelete>
                  </>
                )}
              </FileLabel>

              <FileInput
                type="file"
                id="fileInput"
                accept="audio/*,image/*,.png"
                onChange={handleFileInput}
              />
              {(question.type === "mc" || question.type === "tf") && (
                <WrapAnswer>
                  {question?.options.map((option, index) => (
                    <WrapAnswerInput key={index} $isFill={isOptionsFill[index]}>
                      <input
                        type="radio"
                        name="answer"
                        id={`radio${index}`}
                        value={index}
                        onChange={handleAnswerRadio}
                        checked={index === answerRadio}
                      />
                      <TextAreaWrapper>
                        <TextAreaInput
                          error={!isOptionsFill[index]}
                          label={isOptionsFill[index] ? null : "尚未輸入"}
                          value={inputOptions[index]}
                          onChange={(e) => handleAnswerInput(e, index)}
                        />
                      </TextAreaWrapper>
                    </WrapAnswerInput>
                  ))}
                </WrapAnswer>
              )}
              {question.type === "sa" &&
                question?.options.map((option, index) => (
                  <WrapShortAnswerInput
                    key={index}
                    $isFill={isOptionsFill[index]}
                  >
                    <ShortAnswerInput
                      error={!isOptionsFill[index]}
                      label={isOptionsFill[index] ? null : "尚未輸入"}
                      type="text"
                      value={inputOptions[index]}
                      onChange={(e) => {
                        handleAnswerRadio(e);
                        handleAnswerInput(e, index);
                      }}
                    />
                  </WrapShortAnswerInput>
                ))}
            </EditAreaWrapper>
            <RulesWrapper>
              <InputTitle>題庫名稱</InputTitle>

              <QBankNameInput
                value={qBankName}
                onChange={handleQBankName}
                error={!isQBankNameFill}
                label={isQBankNameFill ? null : "尚未輸入"}
              />
              <InputTitle>題型</InputTitle>
              <WrapSelect
                value={questionType}
                onValueChange={handleQuestionType}
              >
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
              <WrapSelect value={timeLimit} onValueChange={handleTimeLimit}>
                <WrapSelectTrigger>
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

              <SaveButton>
                <div onClick={handleComplete}>
                  <Buttons type="success">完成</Buttons>
                </div>
              </SaveButton>
            </RulesWrapper>
          </Wrapper>
        )}
      </>
    )
  );
};

export default Create;
