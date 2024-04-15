import { database } from "./firebase";
import { ref, update, remove, push, set } from "firebase/database";

export const updateRealTime = (path, data) => {
  return update(ref(database, path), data);
};

export const deleteRealTime = (path) => {
  return remove(ref(database, path));
};

export const pushRealTime = (path, data) => {
  const newRef = push(ref(database, path));
  set(newRef, data);
  return newRef.key;
};
