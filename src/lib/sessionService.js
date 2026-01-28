import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getOrCreateTodaySession(userCode) {
  const today = new Date().toISOString().slice(0, 10);
  // Path now starts with the user's unique code
  const sessionRef = doc(db, "users", userCode, "workoutSessions", today);
  
  const snap = await getDoc(sessionRef);
  if (snap.exists()) return { id: snap.id, ...snap.data() };

  const newSession = { date: today, status: "in_progress" };
  await setDoc(sessionRef, newSession);
  return { id: today, ...newSession };
}


export async function finishSession(userCode, sessionId, totalStats) {
  const sessionRef = doc(db, "users", userCode.toLowerCase().trim(), "workoutSessions", sessionId);
  
  return await updateDoc(sessionRef, {
    completed: true,
    completedAt: new Date(),
    totalWeight: totalStats.weight,
    totalSets: totalStats.sets,
    // You can also save a "Mood" or "Notes" here later
  });
}