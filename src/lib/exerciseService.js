import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Helper to get the reference to a specific user's exercise collection
 */
const getUserExerciseCol = (userCode) => 
  collection(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates");

export async function getExerciseTemplates(userCode) {
  if (!userCode) return [];
  const q = query(getUserExerciseCol(userCode), orderBy("bodyPart"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addExerciseTemplate(userCode, data) {
  return await addDoc(getUserExerciseCol(userCode), data);
}

export async function updateExerciseTemplate(userCode, id, data) {
  const docRef = doc(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates", id);
  return await updateDoc(docRef, data);
}

export async function deleteExerciseTemplate(userCode, id) {
  const docRef = doc(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates", id);
  return await deleteDoc(docRef);
}