import React, { useEffect, useRef, useState } from "react";

import Header from "../../components/Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { useNavigate, useParams } from "react-router-dom";
import { setFireStore } from "@/utils/reviseFireStore";
import { serverTimestamp } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

import { Slide, toast } from "react-toastify";
import ReactLoading from "react-loading";
import TextField from "@mui/material/TextField";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import Mryellow from "@/components/css/animation/Mryellow";
import Mrpurple from "@/components/css/animation/Mrpurple";
import { getAuth } from "firebase/auth";
import { app } from "@/utils/firebase";

const Wrapper = styled.div`
  max-height: 100vh;
  width: 100%;
  display: flex;
  height: 100vh;

  ${theme.breakpoints.sm} {
    flex-direction: column;
  }
`;

const QuestionsAreaWrapper = styled.div`
  position: relative;
  width: 30rem;
  height: 100%;
  background-color: ${theme.colors.dark};

  ${theme.breakpoints.sm} {
    height: auto;
    width: 100%;
    box-shadow: 0px 1px 4px 0px #33333369;
  }
`;

const QuestionsWrapper = styled(ScrollArea)`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  box-shadow: inset -10px 0 6px -10px rgba(0, 0, 0, 0.2);
  position: relative;
  padding-bottom: 7rem;

  ${theme.breakpoints.sm} {
    padding-bottom: 0rem;
  }
`;

const WrapDragDropContext = styled(DragDropContext)`
  width: 1000rem;
`;

const WrapDroppableDiv = styled.div`
  ${theme.breakpoints.sm} {
    display: flex;
    justify-content: center;
  }
`;

const WrapButton = styled.div`
  width: 100%;
  z-index: 100;

  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, 0);

  ${theme.breakpoints.sm} {
    flex-direction: column;
    right: -2rem;
    top: 2rem;
    left: auto;
    /* transform: translate(-5rem); */
    width: 6rem;
  }
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

const WrapDropdownMenuContent = styled(DropdownMenuContent)`
  ${theme.breakpoints.sm} {
    transform: translate(-18%);
  }
`;

const WrapWrapQuestion = styled.div`
  width: 22rem;
  padding: 0.6rem 0rem;
  padding-left: 0.5rem;

  ${theme.breakpoints.sm} {
    width: 10rem;
  }
`;

const WrapQuestion = styled.div`
  background-color: ${({ $editNum }) => ($editNum ? `#bbb` : `#fff`)};

  width: 96%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  text-align: left;
  box-shadow: 0px 0px 4px 0px #33333369;
  ${({ $isDone }) => $isDone === false && `border : 3px solid #dc4141`};
  padding: 5px;
  border-radius: 5px;

  img {
    margin-top: 0.4rem;
    width: 4rem;
    height: 4rem;
  }

  ${theme.breakpoints.sm} {
    img {
      margin-top: 0.4rem;
      width: 3rem;
      height: 3rem;
    }
  }
`;

const FlexTop = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;

  ${theme.breakpoints.sm} {
    img {
      display: none;
    }
  }
`;

const Title = styled.div`
  font-size: 1.4rem;
  width: 73%;
  overflow-wrap: break-word;
  height: 1.6rem;

  ${theme.breakpoints.sm} {
    width: 100%;
    font-size: 1.2rem;
    height: 2.6rem;
  }
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
  padding-top: 2rem;
  height: 100vh;
  overflow: hidden;

  ${theme.breakpoints.sm} {
    margin-top: 1rem;
    height: 250%;
  }
`;

const WrapMryellow = styled.div`
  position: absolute;
  bottom: -60%;
  right: -50%;
  z-index: -1;
`;

const WrapMrpurple = styled.div`
  position: absolute;
  top: -60%;
  left: -50%;
  z-index: -1;
`;

const QuestionInput = styled(TextField)`
  width: 96%;

  & .MuiOutlinedInput-root {
    box-shadow: 0px 0px 4px 0px #33333369;
    font-size: 2.2rem;
    width: 100%;
    background-color: #fff;
  }

  & .MuiOutlinedInput-input {
    text-align: center;
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }

  ${theme.breakpoints.sm} {
    width: 90%;

    & .MuiOutlinedInput-root {
      box-shadow: 0px 0px 4px 0px #33333369;
      font-size: 2.2rem;
      width: 100%;
      margin-top: 0rem;
      padding: 0;
    }

    & .MuiOutlinedInput-input {
      text-align: center;
      padding: 1rem;
    }

    & .MuiFormLabel-root {
      font-size: 1.4rem;
      margin-top: 0rem;
    }
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

  ${theme.breakpoints.sm} {
    width: 90%;
    gap: 1rem;
  }
`;

const WrapAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};
  width: 100%;
  height: 8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  background-color: #fff;
  position: relative;

  input[type="radio"] {
    width: 4.4rem;
    color: ${theme.colors.secondary};
    accent-color: ${theme.colors.tertiary};
  }

  ${theme.breakpoints.sm} {
    height: 5.4rem;
    padding-left: 1rem;

    input[type="radio"] {
      width: 3rem;
    }
  }
`;

const TextAreaInput = styled(TextField)`
  & .MuiOutlinedInput-root {
    font-size: 2rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  ${theme.breakpoints.sm} {
    & .MuiOutlinedInput-root {
      font-size: 1.6rem;
      width: 100%;
    }

    & .MuiOutlinedInput-input {
    }

    & .MuiFormLabel-root {
      font-size: 1.2rem;
      margin-top: 0.4rem;
    }

    & .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

const WrapShortAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};

  width: 80%;
  height: 8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  position: absolute;
  bottom: 12rem;
  background-color: #fff;

  ${theme.breakpoints.sm} {
    height: 5.6rem;
    bottom: 2rem;
  }
`;

const ShortAnswerInput = styled(TextField)`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;

  & .MuiOutlinedInput-root {
    font-size: 2.4rem;
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
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2.4rem;

  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const WrapMedia = styled.div`
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

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const ViewMedia = styled.img`
  max-height: calc(100vh - 40rem);
  max-width: calc(100vw - 50rem);
  object-fit: contain;
  ${theme.breakpoints.sm} {
    max-height: calc(100vh - 54rem);
    max-width: 70vw;
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

const RulesAreaWrapper = styled(ScrollArea)`
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

const WrapQuestionInput = styled.div`
  position: relative;
  width: 100%;
`;

const TitleTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 2.4rem;
  top: 4rem;
  font-size: 1.4rem;

  ${theme.breakpoints.sm} {
    top: 2.8rem;
    right: 4rem;
  }
`;

const OptionTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 0.6rem;
  top: 5.6rem;
  font-size: 1.4rem;

  ${theme.breakpoints.sm} {
    top: 3rem;
  }
`;

const Create = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const user = auth.currentUser;
  let uid = null;
  let ownerName = null;
  if (user) {
    uid = user.uid;
    ownerName = user.displayName;
  }

  const { documentId: getUrlDocumentId, UserId: getUrlUserId } = useParams();
  const {
    data: getQbankData,
    isError: getQbankIsError,
    isLoading: getQbankIsLoading,
  } = useGetFireStore("qbank", getUrlDocumentId);
  const {
    data: getQbanksData,
    isError: qbanksIsError,
    isLoading: qbanksIsLoading,
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

  console.log(getQbanksData);

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
    console.log("setIsDone");
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
    setQuestionType(getQbankData.questions[index].type);
    setTimeLimit(getQbankData.questions[index].timeLimit);
    setStateQuestions(getQbankData.questions);
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
    setTitle(e.target.value.slice(0, 40));
    getQbankData.questions[editNum].title = e.target.value.slice(0, 40);
    handleIsChange();
  }

  function handleAnswerRadio(e) {
    if (question.type === "mc" || question.type === "tf") {
      setAnswerRadio(+e.target.value);
      getQbankData.questions[editNum].answer = +e.target.value;
    }
    if (question.type === "sa") {
      setAnswerRadio(e.target.value.toUpperCase());
      getQbankData.questions[editNum].answer = e.target.value.toUpperCase();
    }
    handleIsChange();
  }

  function handleAnswerInput(e, index) {
    if (questionType === "mc" || questionType === "tf") {
      setInputOptions((inputOptions) => {
        const newArray = [...inputOptions];
        newArray[index] = e.target.value.slice(0, 15);
        return newArray;
      });
      getQbankData.questions[editNum].options[index] = e.target.value.slice(
        0,
        15
      );
    } else {
      setInputOptions((inputOptions) => {
        const newArray = [...inputOptions];
        newArray[index] = e.target.value.toUpperCase().slice(0, 15);
        return newArray;
      });
      getQbankData.questions[editNum].options[index] = e.target.value
        .toUpperCase()
        .slice(0, 15);
    }

    handleIsChange();
  }

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
    setInputOptions(options);
    setTitle("");

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
    setIsDone();

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
    console.log(e);
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
                console.log(getQbankData);
                console.log(editNum);
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

  function handleDeleteMedia() {
    setMediaUrl("");
    getQbankData.questions[editNum].media = "";
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
            <QuestionsAreaWrapper>
              <WrapButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="outline-none">
                    <SingleButton>
                      <Buttons
                        size={window.innerWidth < 940 ? "small" : "medium"}
                      >
                        新增
                      </Buttons>
                    </SingleButton>
                  </DropdownMenuTrigger>
                  <WrapDropdownMenuContent className="border-4">
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
                  </WrapDropdownMenuContent>
                </DropdownMenu>
              </WrapButton>
              <QuestionsWrapper>
                <WrapDragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    WrapDroppable
                    droppableId="123"
                    direction={
                      window.innerWidth < 940 ? "horizontal" : "vertical"
                    }
                  >
                    {(provided, snapshot) => (
                      <WrapDroppableDiv
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
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
                                            {question.title.slice(
                                              0,
                                              window.innerWidth < 940 ? 5 : 16
                                            ) +
                                              `${
                                                question.title?.length >
                                                (window.innerWidth < 940
                                                  ? 5
                                                  : 16)
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
                      </WrapDroppableDiv>
                    )}
                  </Droppable>
                </WrapDragDropContext>
                <ScrollBar orientation="horizontal" />
              </QuestionsWrapper>
            </QuestionsAreaWrapper>
            <EditAreaWrapper>
              <WrapMryellow>
                <Mryellow />
              </WrapMryellow>
              <WrapMrpurple>
                <Mrpurple />
              </WrapMrpurple>
              <WrapQuestionInput>
                <QuestionInput
                  error={!isTitleFill}
                  id="outlined-error"
                  label={isTitleFill ? null : "請輸入題目"}
                  value={title}
                  onChange={handleTitleInput}
                />
                <TitleTextWarning>
                  {title ? title.length : 0}/40
                </TitleTextWarning>
              </WrapQuestionInput>
              {mediaUrl === "" ? (
                <FileLabel htmlFor={"fileInput"}>
                  <p>輸入圖片</p>
                </FileLabel>
              ) : (
                <WrapMedia>
                  <ViewMedia src={mediaUrl} />
                  <InputMediaDelete onClick={handleDeleteMedia}>
                    <Delete size={window.innerWidth < 940 ? 3 : 4.4} />
                  </InputMediaDelete>
                </WrapMedia>
              )}

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
                          label={isOptionsFill[index] ? null : "請輸入選項"}
                          value={inputOptions[index]}
                          onChange={(e) => handleAnswerInput(e, index)}
                        />
                      </TextAreaWrapper>
                      <OptionTextWarning>
                        {inputOptions[index] ? inputOptions[index].length : "0"}
                        /15
                      </OptionTextWarning>
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
                      label={isOptionsFill[index] ? null : "請輸入答案"}
                      type="text"
                      value={inputOptions[index]}
                      onChange={(e) => {
                        handleAnswerRadio(e);
                        handleAnswerInput(e, index);
                      }}
                    />
                    <OptionTextWarning>
                      {inputOptions[index] ? inputOptions[index].length : "0"}
                      /15
                    </OptionTextWarning>
                  </WrapShortAnswerInput>
                ))}
            </EditAreaWrapper>
            <RulesAreaWrapper>
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
              </WrapSelected>

              <SaveButton>
                <Buttons onClick={handleComplete} type="success">
                  完成
                </Buttons>
              </SaveButton>
            </RulesAreaWrapper>
          </Wrapper>
        )}
      </>
    )
  );
};

export default Create;
