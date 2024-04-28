import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Delete from "./Delete";
import Image from "./Image";
import Plus from "./Plus";
import {
  addFireStore,
  deleteFireStore,
  getFireStore,
  setFireStore,
  updateFireStore,
} from "@/utils/reviseFireStore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useGetFireStores } from "@/utils/hook/useGetFireStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateRealTime } from "@/utils/reviseRealTime";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "@/utils/firebase";
import ReactLoading from "react-loading";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";

const WrapDashBoard = styled.div`
  width: 70%;
  margin: 0 auto;
  text-align: left;
  margin-top: 2rem;
`;

const WrapQuestionBanks = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  ${theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const WrapQuestionBank = styled.div`
  width: auto;
  height: 30rem;
  box-shadow: ${theme.shadow};
  border-radius: 5px;
`;
const WrapQBankImg = styled.div`
  height: 16rem;
  display: flex;
  justify-content: center;
`;

const QBankImg = styled.img`
  object-fit: contain;
  margin-top: 1rem;
`;

const WrapQBankInfo = styled.div`
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  gap: 1rem;
`;

const QBankName = styled.div`
  font-size: 2rem;
  border-radius: 5px;
  border: none;
  /* padding: 0 10px; */
`;

const QBankTime = styled.p`
  font-size: 1.4rem;
  color: #adadad;
`;

const WrapQBankButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WrapHoverCardContent = styled(HoverCard.Content)`
  border: 1px solid black;
  padding: 1rem;
  background-color: #fff;
  border-radius: 5px;
`;

const WrapHoverCardArrow = styled(HoverCard.Arrow)`
  color: #fff;
`;

const WrapContextMenuContent = styled(ContextMenuContent)`
  width: 10;
`;

const WrapContextMenuItem = styled(ContextMenuItem)`
  padding: 0.5rem 1rem;
  width: 100%;
  display: flex;
  gap: 2rem;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 3rem;
  cursor: pointer;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const AddQBankButton = styled.div`
  position: fixed;
  right: 4rem;
  bottom: 4rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0px 3px 8px 0px #3333337a;
`;

const HoverCardContent = styled.div`
  color: ${theme.colors.secondary};
  box-shadow: ${theme.shadow};
  position: fixed;
  right: 1rem;
  width: 12rem;
  bottom: 10rem;
  height: 4rem;
  margin-bottom: 1rem;
  line-height: 4rem;
  text-align: center;
  border-radius: 5px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

const DashBoard = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  let uid = null;
  if (user) {
    uid = user.uid;
  }

  const navigate = useNavigate();

  const { userId, setDocumentId } = useGameStore();
  const [isHover, setIsHover] = useState(false);
  const [data, setData] = useState([]);
  const chooseQBankId = useRef("");

  const {
    data: qbanks,
    isError,
    isLoading,
  } = useGetFireStores(`users/${uid}/qbanks`);

  useEffect(() => {
    const fetchData = () => {
      qbanks?.forEach((qbank) => {
        const docRef = doc(db, "qbank", qbank.id);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            // 處理即時更新的資料並放入setData中
            setData((prevData) => {
              const newData = [...prevData];
              const index = newData.findIndex((item) => item.id === qbank.id);
              if (index !== -1) {
                newData[index] = { id: qbank.id, ...docSnapshot.data() };
              } else {
                newData.push({ id: qbank.id, ...docSnapshot.data() });
              }
              return newData;
            });
          } else {
            console.log("Document does not exist");
          }
        });

        // 返回取消監聽的函式以便清理
        return unsubscribe;
      });
    };
    fetchData();
  }, [qbanks]);

  useOnAuthStateChange();

  async function handleAddQBank() {
    const uuid = uuidv4();
    setFireStore(`users/${uid}/qbanks`, uuid, { id: uuid });
    setFireStore("qbank", uuid, {
      editTime: serverTimestamp(),
      name: `${moment().format("YYYY/MM/D h:mm:ss")}`,
      owner: "icecube0816",
      id: uuid,
      mainImg: "",
      questions: [
        {
          answer: 0,
          id: uuid,
          media: "",
          options: ["", "", "", ""],
          timeLimit: 10,
          title: "",
          type: "mc",
        },
      ],
    });
  }

  function handleDelete(id) {
    deleteFireStore(`users/${uid}/qbanks`, id);
    deleteFireStore("qbank", id);
    setData((prevData) => prevData.filter((qbank) => qbank.id !== id));
  }
  function handleRename(e, id) {
    updateFireStore("qbank", id, { name: e.target.value });
  }
  function handleAddImg(e, id) {
    if (e) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (validImageTypes.includes(fileType)) {
        const storage = getStorage();
        const imagesRef = ref(storage, `${serverTimestamp()}`);
        uploadBytes(imagesRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                updateFireStore("qbank", chooseQBankId.current, {
                  mainImg: url,
                });
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
  function handleEdit(id) {
    navigate(`/create/${id}`);
  }

  function handleHost(id) {
    const pin = Math.floor(Math.random() * 900000) + 100000;

    setDocumentId(id);

    updateRealTime(id, {
      id,
      pin: pin.toString(),
      question: { answer: 1, id: 0 },
      state: "lobby",
    });
    navigate(`/host/${id}/${pin}`);
  }

  return (
    <>
      {" "}
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
        <>
          <WrapDashBoard>
            <h2>題庫</h2>
            <WrapQuestionBanks>
              {data &&
                data?.map((item) => (
                  <div key={item.id}>
                    <FileInput
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      onChange={(e) => handleAddImg(e, item.id)}
                    />
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <WrapQuestionBank>
                          <WrapQBankImg>
                            <QBankImg src={item.mainImg} />
                          </WrapQBankImg>
                          <WrapQBankInfo>
                            <QBankName>
                              {item.name.slice(0, 9) +
                                `${item.name.length > 16 ? "..." : ""}`}
                            </QBankName>

                            <QBankTime>
                              上次編輯：
                              {moment
                                .unix(item?.editTime?.seconds)
                                .add(
                                  item?.editTime?.nanoseconds / 1e9,
                                  "seconds"
                                )
                                .format("YYYY-MM-DD")}
                            </QBankTime>

                            <WrapQBankButtons>
                              <div onClick={() => handleEdit(item.id)}>
                                <Buttons type="light" size="small">
                                  編輯
                                </Buttons>
                              </div>

                              <HoverCard.Root>
                                <HoverCard.Trigger>
                                  {" "}
                                  <div
                                    onClick={() =>
                                      item.isDone && handleHost(item.id)
                                    }
                                  >
                                    <Buttons
                                      type={item.isDone ? "success" : "invalid"}
                                      size="small"
                                    >
                                      主持
                                    </Buttons>
                                  </div>
                                </HoverCard.Trigger>
                                {item.isDone || (
                                  <HoverCard.Portal>
                                    <WrapHoverCardContent>
                                      尚未編輯完成
                                      <WrapHoverCardArrow />
                                    </WrapHoverCardContent>
                                  </HoverCard.Portal>
                                )}
                              </HoverCard.Root>
                            </WrapQBankButtons>
                          </WrapQBankInfo>
                        </WrapQuestionBank>
                      </ContextMenuTrigger>

                      <WrapContextMenuContent>
                        <WrapContextMenuItem
                          onClick={() => handleDelete(item.id)}
                        >
                          <Delete size={12} />
                          <p>刪除</p>
                        </WrapContextMenuItem>

                        <WrapContextMenuItem
                          onClick={() => (chooseQBankId.current = item.id)}
                        >
                          <FileLabel htmlFor="fileInput">
                            <Image size={12} /> <p>新增首圖</p>
                          </FileLabel>
                        </WrapContextMenuItem>
                      </WrapContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
            </WrapQuestionBanks>
          </WrapDashBoard>
          <AddQBankButton onClick={handleAddQBank}>
            <div
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <Plus size={6} />
            </div>
          </AddQBankButton>
          {isHover && <HoverCardContent>建立新題庫</HoverCardContent>}
        </>
      )}
    </>
  );
};

export default DashBoard;
