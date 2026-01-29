import { db } from "./firebase";
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";

export const addExerciseToSession = (userCode, dateId, exerciseTemplate) => {
  // 1. Standardize userCode for path safety
  const cleanCode = userCode.toLowerCase().trim();
  
  // 2. Build reference to the specific session's exercise sub-collection
  const sessionRef = doc(db, "users", cleanCode, "workoutSessions", dateId);
  const exercisesSubCol = collection(sessionRef, "exercises");

  // 3. Prepare the data based on our NEW Array-based Template structure
  const exerciseData = {
    name: exerciseTemplate.name,
    bodyPart: exerciseTemplate.bodyPart,
    templateId: exerciseTemplate.id || null, 
    addedAt: serverTimestamp(), // Better for multi-device sync than new Date()
    
    // 🔹 THE FIX: Map the template's array of sets
    // This supports variable weights/reps defined in the library
    sets: exerciseTemplate.sets.map(s => ({
      reps: Number(s.reps),
      weight: Number(s.weight),
      done: false // Reset progress for the new session
    })),
    
    completed: false,
    edited: false
  };

  return addDoc(exercisesSubCol, exerciseData);
};