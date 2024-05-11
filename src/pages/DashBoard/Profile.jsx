import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { app, db } from "@/utils/firebase";
import {
  Avatar as ComAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { doc, onSnapshot } from "firebase/firestore";
import { updateRealTime } from "@/utils/reviseRealTime";
import { getAuth, signOut } from "firebase/auth";

const WarpProfile = styled(ScrollArea)`
  background-color: ${theme.colors.primary};

  height: 100vh;
  padding: 2.6rem;
  width: 22rem;
  text-align: left;
  box-shadow: 0px 3px 3px 3px #ccc;
  position: relative;

  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const WrapLogo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* height: 7rem; */
  width: 100%;
  border-radius: 10px;
  margin: 0 auto;
  cursor: pointer;

  img {
    width: auto;
    height: 4rem;
    margin: 0rem auto;
    margin-top: 2.4rem;
  }
`;

const WrapAvatar = styled(ComAvatar)`
  width: 5rem;
  height: 5rem;
  border: 2px solid #cecece;
`;

const WrapUserInfo = styled.div`
  display: flex;
  gap: 1rem;
  height: auto;
  margin-top: 6rem;
  margin-left: 1rem;
`;

const UserName = styled.p`
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
  width: 16rem;
  /* color: #fff; */
  word-wrap: break-word;
`;

const UserEmail = styled.p`
  color: #656565;
  font-size: 1.3rem;
  width: 16rem;
  word-wrap: break-word;
`;

const UserId = styled.p`
  color: #656565;
  font-size: 1.3rem;
`;

const SheetHr = styled.hr`
  border: none;
  height: 1px;
  margin: 2rem 0;
  background-color: #ffffff;
`;

const Title = styled.div`
  color: #fff;
`;

const Logout = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 2rem;
`;

const WrapShareQBanks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 2rem;
`;

const WrapShareQBank = styled.div`
  background-color: #fffffa;
  padding: 1rem;
  width: 100%;
  &:hover {
    background-color: #cccccc5f;
    cursor: pointer;
  }
`;

const QbankName = styled.div`
  font-size: 1.4rem;
`;

const QBankImg = styled.img`
  width: 20rem;
  height: 10rem;
  object-fit: cover;
  margin-top: 1rem;
`;

const WrapInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const WrapQBankAvatars = styled.div`
  display: flex;
  gap: -10rem;
  margin-top: 1rem;
`;

const QBankAvatar = styled(ComAvatar)``;

const QBankAvatarFallback = styled(AvatarFallback)`
  font-size: 1rem;
`;

const Profile = () => {
  const [isLogoutBtn, setIsLogoutBtn] = useState(false);
  const [uid, setUid] = useState(null);
  const [shareData, setShareData] = useState([]);
  const {
    data: shareQbanks,
    isError: shareIsError,
    isLoading: shareIsLoading,
  } = useGetFireStores(`users/${uid}/share`);

  const {
    data: getUserData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetFireStore("users", uid);

  const {
    data: getUsersData,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useGetFireStores("users");

  const userUid = useOnAuthStateChange();
  const auth = getAuth(app);

  useEffect(() => {
    setUid(userUid);
  }, [userUid]);

  useEffect(() => {
    const fetchData = () => {
      shareQbanks?.forEach((qbank) => {
        const docRef = doc(db, `qbank`, qbank.id);
        const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
          if (docSnapshot) {
            // 處理即時更新的資料並放入setData中
            setShareData((prevData) => {
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
  }, [shareQbanks]);

  const navigate = useNavigate();
  function handleHost(e, id) {
    e.stopPropagation();

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

  function handleUserBtn() {
    setIsLogoutBtn(!isLogoutBtn);
  }

  function handleSharedQBank(e, id) {
    navigate(`/create/${id}`);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
        console.log("Sign-out error");
      });
  }

  return usersIsLoading || userIsLoading || shareIsLoading ? (
    <WarpProfile>
      {" "}
      <WrapUserInfo></WrapUserInfo>
      <SheetHr />
      <p>共同編輯題庫</p>
    </WarpProfile>
  ) : (
    <WarpProfile>
      <WrapLogo onClick={() => navigate("/")}>
        <img src="/logo.png" />
      </WrapLogo>

      <WrapUserInfo>
        <WrapAvatar onClick={handleUserBtn}>
          <AvatarImage src="" />
          <AvatarFallback>{getUserData?.name.slice(0, 2)}</AvatarFallback>
        </WrapAvatar>
        <div>
          <UserName>{getUserData?.name}</UserName>
          {/* <UserEmail>{getUserData?.email}</UserEmail> */}
          <UserId>id：{getUserData?.userId}</UserId>
        </div>
      </WrapUserInfo>
      <SheetHr />
      {/* <Title>共同編輯題庫</Title> */}
      <WrapShareQBanks>
        {shareData?.map((qbank) => {
          return (
            qbank.name && (
              <WrapShareQBank
                onClick={(e) => handleSharedQBank(e, qbank.id)}
                key={qbank.id}
              >
                <QbankName>{qbank.name}</QbankName>
                <QBankImg
                  src={qbank.mainImg ? qbank.mainImg : "/bankImg.jpg"}
                  alt=""
                />
                <WrapInfo>
                  {" "}
                  <WrapQBankAvatars>
                    <QBankAvatar>
                      <AvatarImage src="" />
                      <QBankAvatarFallback>
                        {qbank.ownerName.slice(0, 2)}
                      </QBankAvatarFallback>
                    </QBankAvatar>
                  </WrapQBankAvatars>
                  <Buttons
                    size="small"
                    onClick={(e) => handleHost(e, qbank.id)}
                    style={{ width: "6rem" }}
                    type={qbank.isDone ? "success" : "invalid"}
                  >
                    主持
                  </Buttons>{" "}
                </WrapInfo>
              </WrapShareQBank>
            )
          );
        })}
      </WrapShareQBanks>
      <Logout onClick={handleLogout}>
        <Buttons size="small">登出</Buttons>
      </Logout>
    </WarpProfile>
  );
};

export default Profile;
