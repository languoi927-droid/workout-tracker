import { db } from "./firebase";
import { collection, doc, addDoc } from "firebase/firestore";

// Now accepting userCode to build the private path
export const addExerciseToSession = (userCode, dateId, exerciseTemplate) => {
  // Path: users/[userCode]/workoutSessions/[dateId]
  const sessionRef = doc(db, "users", userCode.toLowerCase().trim(), "workoutSessions", dateId);
  const exercisesSubCol = collection(sessionRef, "exercises");

  return addDoc(exercisesSubCol, {
    name: exerciseTemplate.name,
    bodyPart: exerciseTemplate.bodyPart,
    templateId: exerciseTemplate.id, 
    addedAt: new Date(),
    sets: Array.from({ length: Number(exerciseTemplate.sets) }, () => ({
      reps: Number(exerciseTemplate.reps),
      weight: Number(exerciseTemplate.weight),
      done: false
    })),
    completed: false,
    edited: false
  });
};