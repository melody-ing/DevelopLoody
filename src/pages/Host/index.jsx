import React, { useEffect, useState } from "react";
import { database } from "../../utils/firebase";
import { onValue, ref } from "firebase/database";

const Host = () => {
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    const userRef = ref(database, "users");

    const unsubscribe = onValue(userRef, (snapshot) => {
      const users = snapshot.val();
      if (users !== null) setAllUser(Object.values(users));
    });

    // 在組件卸載時清理監聽器
    return () => {
      unsubscribe();
    };
  }, [database]);
  console.log(allUser);

  return (
    <div>
      <h1>我們Max姓甚麼</h1>
      <h3>B: 林</h3>
      <h3>C: 許</h3>
      <h3>A: 李</h3>
      <h3>D: 陳</h3>

      {allUser?.map((user) => {
        if (user.selected) {
          return (
            <div key={user.id}>
              <span>{user.name}</span>
              {"  "}
              <span style={{ color: "red" }}>
                {user.selected === "C" ? "Correct" : "Incorrect"}
              </span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Host;
