import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getWorkoutHistory = async (userCode, startDate, endDate) => {
  const userPath = userCode.toLowerCase().trim();
  const sessionsRef = collection(db, "users", userPath, "workoutSessions");
  
  // 1. Get the session parent documents in the date range
  const q = query(
    sessionsRef,
    where("__name__", ">=", startDate),
    where("__name__", "<=", endDate)
  );

  const querySnapshot = await getDocs(q);

  // 2. Map sessions to promises that fetch their specific exercises
  const sessionPromises = querySnapshot.docs.map(async (sessionDoc) => {
    const sessionData = sessionDoc.data();
    const date = sessionDoc.id;
    
    // Path to the sub-collection: users/[id]/workoutSessions/[date]/exercises
    const exRef = collection(db, "users", userPath, "workoutSessions", date, "exercises");
    const exSnap = await getDocs(exRef);
    
    // Return the array of exercises, injecting session-level data (like date and status)
    return exSnap.docs.map(exDoc => ({
      ...exDoc.data(),
      id: exDoc.id,
      date: date,
      isSessionCompleted: sessionData.completed || false,
      totalDailyVolume: sessionData.totalWeight || 0
    }));
  });

  // 3. Wait for all sub-collections to load and flatten the results
  const results = await Promise.all(sessionPromises);
  return results.flat(); 
};