import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection,getDocs} from "firebase/firestore";
import { db } from "./firebase";
import { updateExerciseTemplate } from "./exerciseService";

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
  const cleanCode = userCode.toLowerCase().trim();
  const sessionRef = doc(db, "users", cleanCode, "workoutSessions", sessionId);

  console.log("🚀 Finishing session:", sessionId);

  await updateDoc(sessionRef, {
    completed: true,
    completedAt: serverTimestamp(),
    totalWeight: totalStats.weight,
    totalSets: totalStats.sets,
    status: "finished"
  });

  const exercisesRef = collection(db, "users", cleanCode, "workoutSessions", sessionId, "exercises");
  const exSnap = await getDocs(exercisesRef);
  
  console.log(`🔎 Found ${exSnap.docs.length} exercises in session`);

  const updatePromises = exSnap.docs.map(async (exDoc) => {
    const data = exDoc.data();
    
    // Log the check results
    console.log(`Checking "${data.name}": templateId exists? ${!!data.templateId}, was edited? ${!!data.edited}`);

    if (data.templateId && data.edited) {
      console.log(`✅ Updating library for: ${data.name} (ID: ${data.templateId})`);
      
      const cleanedSets = data.sets.map(({ weight, reps }) => ({ 
        weight: Number(weight), 
        reps: Number(reps) 
      }));
      
      return updateExerciseTemplate(cleanCode, data.templateId, {
        sets: cleanedSets,
        lastUsed: serverTimestamp()
      });
    } else {
      console.warn(`⚠️ Skipping library update for "${data.name}" because it wasn't edited or has no templateId.`);
    }
  });

  await Promise.all(updatePromises);
  console.log("🏁 FinishSession complete!");
}