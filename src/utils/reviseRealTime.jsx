import { database } from "./firebase";
import { ref, update, remove } from "firebase/database";

export const updateRealTime = (path, data) => {
  return update(ref(database, path), data);
};

export const deleteRealTime = (path) => {
  return remove(ref(database, path));
};
