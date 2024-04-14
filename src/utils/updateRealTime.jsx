import { database } from "./firebase";
import { ref, update } from "firebase/database";

export const updateRealTime = (path, data) => {
  update(ref(database, path), data);
};
