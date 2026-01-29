import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// Helper for path consistency
const getUserTemplateCol = (userCode) => 
  collection(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates");

// 🔹 Add exercise template
export async function addExerciseTemplate(userCode, data) {
  // data should be { name, bodyPart, sets: [...] }
  return await addDoc(getUserTemplateCol(userCode), {
    ...data,
    createdAt: serverTimestamp()
  });
}

// 🔹 Get all templates
export async function getExerciseTemplates(userCode) {
  if (!userCode) return [];
  
  const q = query(
    getUserTemplateCol(userCode), 
    orderBy("name") // Sorting by name is usually better for a library list
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ 
    id: d.id, 
    ...d.data() 
  }));
}

// 🔹 Update an existing template
export async function updateExerciseTemplate(userCode, templateId, data) {
  const ref = doc(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates", templateId);
  return await updateDoc(ref, {
    ...data,
    lastUpdated: serverTimestamp()
  });
}

// 🔹 Delete a template
export async function deleteExerciseTemplate(userCode, templateId) {
  const ref = doc(db, "users", userCode.toLowerCase().trim(), "exerciseTemplates", templateId);
  return await deleteDoc(ref);
}