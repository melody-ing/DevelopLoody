import React from "react";
import { Outlet } from "react-router-dom";
import PrimaryBg from "../../components/css/PrimaryBg";
import { styled } from "styled-components";

const WrapHost = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

const Host = () => {
  // const [allUser, setAllUser] = useState([]);

  // useEffect(() => {
  //   const userRef = ref(database, "users");

  //   const unsubscribe = onValue(userRef, (snapshot) => {
  //     const users = snapshot.val();
  //     if (users !== null) setAllUser(Object.values(users));
  //   });

  //   // 在組件卸載時清理監聽器
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [database]);
  // console.log(allUser);

  return (
    <WrapHost>
      <Outlet />
    </WrapHost>
  );
};

export default Host;
