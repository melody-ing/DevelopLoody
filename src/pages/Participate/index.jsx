import React, { useState } from "react";
import Answer from "./Answer";
import { database } from "../../utils/firebase";
import { ref, push, set } from "firebase/database";

const Participate = () => {
  const [isJoin, setIsJoin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  function handleJoin() {
    if (userName !== "") {
      setIsJoin(true);

      const userRef = ref(database, "users");
      const newUserRef = push(userRef);
      set(newUserRef, {
        id: newUserRef.key,
        name: userName,
        selected: "",
        score: 0,
      });
      setUserId(newUserRef.key);
    }
  }

  return isJoin ? (
    <Answer userId={userId} />
  ) : (
    <div>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default Participate;
