import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function getOrCreateTodaySession(userCode) {
  // Standardize the code
  const cleanCode = userCode.toLowerCase().trim();
  
  // Use local date string (YYYY-MM-DD) to avoid timezone "day-jumping"
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const sessionRef = doc(db, "users", cleanCode, "workoutSessions", today);
  const snap = await getDoc(sessionRef);

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }

  const newSession = { 
    date: today, 
    status: "in_progress", 
    completed: false,
    createdAt: serverTimestamp() 
  };

  await setDoc(sessionRef, newSession);
  return { id: today, ...newSession };
}

export async function finishSession(userCode, sessionId, totalStats) {
  const sessionRef = doc(db, "users", userCode.toLowerCase().trim(), "workoutSessions", sessionId);
  
  return await updateDoc(sessionRef, {
    completed: true,
    completedAt: serverTimestamp(), // Use server time for accurate history
    totalWeight: totalStats.weight,
    totalSets: totalStats.sets,
    status: "finished"
  });
}