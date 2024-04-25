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

import { app } from "@/utils/firebase";

const HeaderInput = styled.p`
  width: 100%;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.6rem;
  border: 1px solid #ddd;
`;

const QBankNameInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2rem;
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

const WrapQuestion = styled.div`
  background-color: ${({ $editNum }) => $editNum && "rgb(238, 238, 238)"};
  margin: 3px;
  margin-top: 1rem;
  margin-bottom: 1.6rem;
  width: 96%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;

  text-align: left;
  box-shadow: 0px 0px 4px 0px #33333369;
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
`;

const Title = styled.p`
  font-size: 16px;
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

const QuestionP = styled.p`
  margin-top: 2rem;
  width: 96%;
  height: auto;
  border-radius: 5px;
  border: none;
  box-shadow: 0px 0px 4px 0px #33333369;
  padding: 10px;
  font-size: 26px;
  color: ${theme.colors.info};
  line-height: 3.6rem;
  text-align: center;
  display: flex;
  align-items: center;
`;

const QuestionInput = styled.input`
  width: 100%;
  outline: none;
  text-align: center;
  border: none;
  font-size: 3rem;
`;

const WrapAnswer = styled.div`
  width: 94%;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 2rem;
  margin-top: 4rem;
  position: absolute;
  bottom: 2rem;
`;

const WrapAnswerInput = styled.div`
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

const WrapShortAnswerInput = styled.div`
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

const ShortAnswerInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;
`;

const TextAreaWrapper = styled.p`
  width: 100%;
  max-width: 34rem;
  height: 5.4rem;
  font-size: 20px;
  color: ${theme.colors.info};
  display: flex;
  align-items: center;
`;

const TextAreaInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
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
    max-height: 30rem;
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
  const navigate = useNavigate();
  const { documentId, userId } = useParams();
  let getQbankData = useGetFireStore("qbank", documentId);

  const [editNum, setEditNum] = useState(0);
  // const qBankNameRef = useRef(null);
  // const titleRef = useRef(null);
  // const answerRefs = useRef([]);
  const question = getQbankData?.questions[editNum];
  const [answerRadio, setAnswerRadio] = useState(0);
  const [questionType, setQuestionType] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const [stateQuestions, setStateQuestions] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [qBankName, setQBankName] = useState("");

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in");
      } else {
        console.log("User is not signed in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  function debounce(fn, delay = 100) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  useEffect(() => {
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
      setOptions(question.options);
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
    setFireStore("qbank", documentId, getQbankData);
  };

  function handlePickQuestion(index) {
    setEditNum(index);

    // if (editNum !== index) {
    //   clearTextContent();
    // }
  }

  // function clearTextContent() {
  //   if (titleRef.current.textContent) {
  //     titleRef.current.textContent = "";
  //   }

  //   if (answerRefs.current.textContent) {
  //     for (let i = 0; i < answerRefs.current.length; i++) {
  //       answerRefs.current[i].textContent = "";
  //     }
  //   }
  // }

  // const editTitle = debounce((title) => {
  //   getQbankData.questions[editNum].title = title;
  //   setFireStore("qbank", documentId, getQbankData);
  // });
  function handleTitleInput(e) {
    setTitle(e.target.value);
    getQbankData.questions[editNum].title = e.target.value;
    setFireStore("qbank", documentId, getQbankData);
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
    setFireStore("qbank", documentId, getQbankData);
  }

  // const editAnswers = debounce((index) => {
  //   getQbankData.questions[editNum].options[index] =
  //     answerRefs.current[index].textContent;
  //   setFireStore("qbank", documentId, getQbankData);
  // });
  function handleAnswerInput(e, index) {
    setOptions((options) => {
      const newArray = [...options];
      newArray[index] = e.target.value;
      return newArray;
    });
    getQbankData.questions[editNum].options[index] = e.target.value;
    setFireStore("qbank", documentId, getQbankData);
  }

  // const editQBankName = debounce(() => {
  //   getQbankData.name = qBankNameRef.current.textContent;
  //   setFireStore("qbank", documentId, getQbankData);
  // });
  function handleQBankName(e) {
    setQBankName(e.target.value);
    // editQBankName();
    getQbankData.name = e.target.value;
    setFireStore("qbank", documentId, getQbankData);
  }

  function handleQuestionType(e) {
    setQuestionType(e);
    getQbankData.questions[editNum].type = e;

    if (e === "mc") getQbankData.questions[editNum].options = ["", "", "", ""];
    if (e === "tf") getQbankData.questions[editNum].options = ["是", "否"];
    if (e === "sa") getQbankData.questions[editNum].options = [""];

    setFireStore("qbank", documentId, getQbankData);
  }

  function handleTimeLimit(e) {
    setTimeLimit(e);
    getQbankData.questions[editNum].timeLimit = e;
    setFireStore("qbank", documentId, getQbankData);
  }

  function handleAddQuestion(type) {
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
    setFireStore("qbank", documentId, getQbankData);
  }

  function handleClone(index, e) {
    e.stopPropagation();
    getQbankData.questions.splice(index, 0, getQbankData.questions[index]);
    setFireStore("qbank", documentId, getQbankData);
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
    setFireStore("qbank", documentId, getQbankData);
  }

  function handleFileInput(e) {
    e.preventDefault();
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
        const imagesRef = ref(storage, `${Date.now()}`);
        uploadBytes(imagesRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setMediaUrl(url);
                getQbankData.questions[editNum].media = url;
                setFireStore("qbank", documentId, getQbankData);
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
    e.preventDefault();

    setMediaUrl("");
    getQbankData.questions[editNum].media = "";
    setFireStore("qbank", documentId, getQbankData);
  }

  function handleComplete() {
    getQbankData.editTime = serverTimestamp();
    setFireStore("qbank", documentId, getQbankData);
    navigate(`/dashboard`);
  }

  return (
    getQbankData && (
      <>
        <Header />
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
                                  <WrapQuestion
                                    key={question.id}
                                    $editNum={editNum === index}
                                    onClick={() => handlePickQuestion(index)}
                                  >
                                    <FlexTop>
                                      <img
                                        src={`/icon/${question.type}.png`}
                                        alt=""
                                      />
                                      <Title>{question.title}</Title>
                                    </FlexTop>
                                    <Information>
                                      <div
                                        onClick={(e) => handleClone(index, e)}
                                      >
                                        <Clone />
                                      </div>
                                      <p>{index + 1}</p>
                                      <div
                                        onClick={(e) => handleDelete(index, e)}
                                      >
                                        <Delete />
                                      </div>
                                    </Information>
                                  </WrapQuestion>
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
            <QuestionP>
              <QuestionInput value={title} onChange={handleTitleInput} />
            </QuestionP>
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
                  <WrapAnswerInput key={index}>
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
                        value={option}
                        onChange={(e) => handleAnswerInput(e, index)}
                      />
                    </TextAreaWrapper>
                  </WrapAnswerInput>
                ))}
              </WrapAnswer>
            )}
            {question.type === "sa" &&
              question?.options.map((option, index) => (
                <WrapShortAnswerInput key={index}>
                  <ShortAnswerInput
                    type="text"
                    value={option}
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

            <HeaderInput>
              <QBankNameInput value={qBankName} onChange={handleQBankName} />
            </HeaderInput>
            <InputTitle>題型</InputTitle>
            <WrapSelect value={questionType} onValueChange={handleQuestionType}>
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
      </>
    )
  );
};

export default Create;
