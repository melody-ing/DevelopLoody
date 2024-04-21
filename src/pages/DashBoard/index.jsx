import React, { useState } from "react";
import Header from "../../components/Header";
import { useGameStore } from "../../utils/hook/useGameStore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { setFireStore } from "@/utils/reviseFireStore";

const DashBoard = () => {
  const navigate = useNavigate();
  const { userId, documentId } = useGameStore();
  console.log(userId, documentId);
  const [items, setItems] = useState(["1", "2", "3"]);

  const onDragEnd = (event) => {
    const { source, destination } = event;

    if (!destination) {
      return;
    }

    let newItems = [...items];
    const [remove] = newItems.splice(source.index, 1);

    newItems.splice(destination.index, 0, remove);
    setItems(newItems);
  };

  async function handleAddFireStore() {
    navigate(`/create/${userId}/${documentId}`);

    await setFireStore("qbank", documentId, {
      id: "uRjHQ7uQS06iBADYJSSH",
      name: "Test question bank",
      questions: [
        {
          answer: 1,
          media: "",
          options: ["一", "二", "三", "四"],
          timeLimit: 10,
          title: "早餐吃甚麼?",
          type: "mc",
        },
        {
          answer: 0,
          media: "",
          options: ["T", "F"],
          timeLimit: 60,
          title: "哈樓你好嗎?",
          type: "tf",
        },
      ],
    });
  }

  return (
    <>
      <Header />
      <a onClick={handleAddFireStore}>create</a>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="123">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default DashBoard;
