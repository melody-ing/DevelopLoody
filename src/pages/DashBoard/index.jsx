import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
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
  deleteFireStore,
  setFireStore,
  updateFireStore,
} from "@/utils/reviseFireStore";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useGetFireStores } from "@/utils/hook/useGetFireStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateRealTime } from "@/utils/reviseRealTime";
import { getAuth } from "firebase/auth";
import { app, db } from "@/utils/firebase";
import ReactLoading from "react-loading";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import Profile from "./Profile";
import Share from "./Share";
import { Slide, toast } from "react-toastify";
import HostButton from "./HostButton";

const WrapProfile = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
`;

const WrapDashBoard = styled.div`
  width: 70%;
  margin: 2rem auto 4rem;
  margin-left: 34rem;
  text-align: left;

  ${theme.breakpoints.md} {
    width: 55%;
    h2 {
      font-size: 3rem;
    }
  }

  ${theme.breakpoints.sm} {
    margin: 0 auto;
    width: 90%;
  }
`;

const WrapQbanks = styled.div``;

const DashBoardTitle = styled.h3`
  display: inline-block;
`;

const QbankNum = styled.p`
  display: inline-block;
  margin-left: 3rem;
`;

const WrapQuestionBanks = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  gap: 2rem;

  ${theme.breakpoints.md} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${theme.breakpoints.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WrapQuestionBank = styled.div`
  width: 100%;
  height: 30rem;
  box-shadow: ${theme.shadow};
  border-radius: 5px;
`;
const WrapQBankImg = styled.div`
  height: 16rem;
  display: flex;
  justify-content: center;
  position: relative;
`;

const QuestionsQuantity = styled.p`
  position: absolute;
  font-size: 1.4rem;
  right: 0.5rem;
  bottom: 1rem;
  background-color: #cccccc85;
  border-radius: 5px;
  padding: 0rem 0.5rem;
`;

const QBankImg = styled.img`
  object-fit: contain;
  margin-top: 1rem;
`;

const WrapQBankInfo = styled.div`
  margin: 0rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  gap: 1rem;

  ${theme.breakpoints.sm} {
    margin: 1rem 1rem;
  }
`;

const QBankName = styled.div`
  font-size: 1.6rem;
  height: 4.4rem;
  line-height: 2.6rem;
  border-radius: 5px;
  border: none;

  ${theme.breakpoints.md} {
    font-size: 1.8rem;
  }
  ${theme.breakpoints.sm} {
    font-size: 1.6rem;
  }
`;

const QBankTime = styled.p`
  font-size: 1.4rem;
  color: #adadad;

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
  }
`;

const WrapQBankButtons = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
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
  /* width: 10; */
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

const CloseShareDialog = styled.div`
  display: ${({ $isShareOpen }) => ($isShareOpen ? "block" : "none")};

  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #22222296;

  top: 0;
  left: 0;
`;

const WrapShareDialog = styled.div`
  display: ${({ $isShareOpen }) => ($isShareOpen ? "block" : "none")};

  z-index: 300;
`;

const ShareDialog = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  width: 50rem;
  height: 18rem;
  background-color: #fff;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 3rem;
  text-align: start;
`;
const WrapTrans = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ShareTitle = styled.h3``;

const ShareInput = styled.input`
  margin: 2rem 0;
  border-radius: 5px;
  padding: 0 1rem;
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
  background: linear-gradient(to top, #f7e8f1, #fff);

  ${theme.breakpoints.sm} {
    right: 2rem;
    bottom: 2rem;
    width: 4.5rem;
    height: 4.5rem;
    padding: 0.5rem;
  }
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

const HoverCardContent = styled.div`
  color: ${theme.colors.secondary};
  background-color: #fff;

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
  let ownerName = null;
  if (user) {
    uid = user.uid;
    ownerName = user.displayName;
  }

  const navigate = useNavigate();

  const [isHover, setIsHover] = useState(false);
  const [isHostHover, setIsHostHover] = useState(false);
  const [data, setData] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareQBankId, setShareQBankId] = useState(null);
  const [shareToUserId, setShareToUserId] = useState("");
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
      name: `${moment().format("YYYY/MM/D h:mm")}`,
      owner: uid,
      ownerName,
      id: uuid,
      mainImg:
        "https://firebasestorage.googleapis.com/v0/b/loody-ing.appspot.com/o/1714835814726?alt=media&token=1b589a8e-8b0e-49c3-b4a1-4c496085e70b",
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

  console.log(shareQBankId);
  async function handleShare() {
    const q = query(
      collection(db, "users"),
      where("userId", "==", shareToUserId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      console.log(querySnapshot.docs.length);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setFireStore(
          `users/${doc.id}/share`,
          shareQBankId,
          {
            id: shareQBankId,
          },
          { merge: true }
        );
      });

      toast.warn("分享成功", {
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
    } else {
      console.log("no have");
      toast.error("無此使用者", {
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
    }
    setShareToUserId("");
    setIsShareOpen(false);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "確定要刪除嗎?(會連同分享給他人的資料一起刪掉)"
    );
    if (confirmDelete) {
      deleteFireStore(`users/${uid}/qbanks`, id);
      deleteFireStore("qbank", id);
      setData((prevData) => prevData.filter((qbank) => qbank.id !== id));

      const q = query(collection(db, "users"), where("capital", "==", true));
    }
  }

  function handleAddImg(e, id) {
    if (e) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (validImageTypes.includes(fileType)) {
        const storage = getStorage();
        const imagesRef = ref(storage, `${Date.now()}`);
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
          <WrapProfile>
            <Profile />
          </WrapProfile>
          <WrapDashBoard>
            <WrapQbanks>
              <DashBoardTitle>所有Loody</DashBoardTitle>
              <QbankNum>題庫數量：{data && data.length}</QbankNum>
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
                              <QBankImg
                                src={
                                  item.mainImg ? item.mainImg : "/bankImg.jpg"
                                }
                              />
                              <QuestionsQuantity>
                                {item.questions.length}題
                              </QuestionsQuantity>
                            </WrapQBankImg>
                            <WrapQBankInfo>
                              <QBankName>
                                {item.name.slice(0, 15) +
                                  `${item.name.length > 15 ? "..." : ""}`}
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

                              <HostButton item={item} />
                            </WrapQBankInfo>
                          </WrapQuestionBank>
                        </ContextMenuTrigger>

                        <WrapContextMenuContent>
                          <WrapContextMenuItem
                            onClick={() => {
                              setIsShareOpen(true);
                              setShareQBankId(item.id);
                            }}
                          >
                            <Share size={12} />
                            <p>分享</p>
                          </WrapContextMenuItem>

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
            </WrapQbanks>
          </WrapDashBoard>
          <CloseShareDialog
            $isShareOpen={isShareOpen}
            onClick={() => {
              setIsShareOpen(false);
              setShareToUserId("");
            }}
          >
            {" "}
          </CloseShareDialog>
          <WrapShareDialog $isShareOpen={isShareOpen}>
            <ShareDialog>
              <ShareTitle>要分享給誰？</ShareTitle>
              <WrapTrans>
                <ShareInput
                  placeholder="請輸入使用者ID"
                  value={shareToUserId}
                  onChange={(e) => setShareToUserId(e.target.value)}
                ></ShareInput>
                <div onClick={() => handleShare()}>
                  <Buttons style={{ width: "8rem", height: "3.6rem" }}>
                    分享
                  </Buttons>
                </div>
              </WrapTrans>
            </ShareDialog>
          </WrapShareDialog>

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
