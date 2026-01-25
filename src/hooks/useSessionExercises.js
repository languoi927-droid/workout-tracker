import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * Real-time hook to fetch exercises for a specific user's session
 * @param {string} userCode - The unique code of the logged-in user
 * @param {string} sessionId - The date string (e.g., "2026-01-25")
 */
export function useSessionExercises(userCode, sessionId) {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Both userCode and sessionId are required to build the correct path
    if (!userCode || !sessionId) return;

    // NEW PATH: users -> [userCode] -> workoutSessions -> [sessionId] -> exercises
    const q = query(
      collection(db, "users", userCode, "workoutSessions", sessionId, "exercises"), 
      orderBy("addedAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      // We map the Firestore doc ID to 'id' to ensure buttons work correctly
      setExercises(snap.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      })));
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });

    return () => unsubscribe();
  }, [userCode, sessionId]);

  return exercises;
}