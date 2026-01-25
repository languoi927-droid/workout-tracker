import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// Helper to get the correct user-specific collection path
const getUserTemplateCol = (userCode) => 
  collection(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates");

// 🔹 Add exercise template (Private to User)
export async function addExercise(userCode, name, bodyPart, defaultSets = []) {
  return await addDoc(getUserTemplateCol(userCode), {
    name,
    bodyPart,
    defaultSets,
    createdAt: serverTimestamp()
  });
}

// 🔹 Get all exercise templates (Private to User)
export async function getExercises(userCode) {
  if (!userCode) return [];
  
  const q = query(
    getUserTemplateCol(userCode), 
    orderBy("bodyPart")
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ 
    id: d.id, 
    ...d.data() 
  }));
}