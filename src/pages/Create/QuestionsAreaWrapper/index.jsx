import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { setFireStore } from "@/utils/reviseFireStore";
import { v4 as uuidv4 } from "uuid";
import Clone from "../svg/Clone";
import Delete from "../svg/Delete";

const WrapQuestionsAreaWrapper = styled.div`
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
    top: 2.6rem;
    left: auto;
    width: 6rem;
  }
`;

const SingleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropImg = styled.img`
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;

  ${theme.breakpoints.sm} {
    width: 2rem;
    height: 2rem;
  }
`;

const WrapDropdownMenuContent = styled(DropdownMenuContent)`
  ${theme.breakpoints.sm} {
    transform: translate(-2%);
  }
`;

const WrapDropdownMenuSeparator = styled(DropdownMenuSeparator)``;

const WrapDropdownMenuItem = styled(DropdownMenuItem)`
  ${theme.breakpoints.sm} {
    font-size: 1.6rem;
    padding-right: 1rem;
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

const QuestionsAreaWrapper = ({
  getQbankData,
  setIsDone,
  setEditNum,
  setTitle,
  setInputOptions,
  setQuestionType,
  setTimeLimit,
  setStateQuestions,
  getUrlDocumentId,
  editNum,
  stateQuestions,
  setAnswerRadio,
}) => {
  function onDragEnd(event) {
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
  }

  function handlePickQuestion(index) {
    setIsDone();
    setEditNum(index);
    setTitle(getQbankData.questions[index].title);
    setInputOptions(getQbankData.questions[index].options);
    setQuestionType(getQbankData.questions[index].type);
    setTimeLimit(getQbankData.questions[index].timeLimit);
    setAnswerRadio(getQbankData.questions[index].answer);
    setStateQuestions(getQbankData.questions);
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
    if (index === 0) {
      setEditNum(index);
    } else if (index === editNum) {
      setEditNum(index - 1);
    } else if (editNum >= getQbankData.questions.length - 1) {
      setEditNum(editNum - 1);
    }
    getQbankData.questions.splice(index, 1);
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }
  return (
    <WrapQuestionsAreaWrapper>
      <WrapButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="outline-none">
            <SingleButton>
              <Buttons size={window.innerWidth < 940 ? "small" : "medium"}>
                新增
              </Buttons>
            </SingleButton>
          </DropdownMenuTrigger>
          <WrapDropdownMenuContent className="border-4">
            <DropdownMenuLabel className="text-2xl ">
              題目種類
            </DropdownMenuLabel>
            <WrapDropdownMenuSeparator />
            {[
              { name: "單選題", id: "mc" },
              { name: "是非題", id: "tf" },
              { name: "簡答題", id: "sa" },
            ].map((item, index) => {
              return (
                <WrapDropdownMenuItem
                  key={index}
                  onClick={() => handleAddQuestion(item.id)}
                  className="text-3xl pr-44 py-5 cursor-pointer"
                >
                  <DropImg src={`/icon/${item.id}.png`} alt="" />
                  {item.name}
                </WrapDropdownMenuItem>
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
            direction={window.innerWidth < 940 ? "horizontal" : "vertical"}
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
                                onClick={() => handlePickQuestion(index)}
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
                                        (window.innerWidth < 940 ? 5 : 16)
                                          ? "..."
                                          : ""
                                      }`}
                                  </Title>
                                </FlexTop>
                                <Information>
                                  <div onClick={(e) => handleClone(index, e)}>
                                    <Clone />
                                  </div>
                                  <p>{index + 1}</p>
                                  <div onClick={(e) => handleDelete(index, e)}>
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
    </WrapQuestionsAreaWrapper>
  );
};

export default QuestionsAreaWrapper;
