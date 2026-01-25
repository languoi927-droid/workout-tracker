import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

// 1. ADDED: userCode must be passed down from ActiveSession
export default function ExerciseInSession({ exercise, sessionId, userCode }) {
  
  // 2. UPDATED PATH: users/[userCode]/workoutSessions/[sessionId]/exercises/[exerciseId]
  if (!userCode || !sessionId || !exercise.id) {
    console.error("Missing path context", { userCode, sessionId, exerciseId: exercise.id });
    return null; 
  }

  const ref = doc(db, "users", userCode, "workoutSessions", sessionId, "exercises", exercise.id);

  const safeUpdate = async (data) => {
    try {
      await updateDoc(ref, data);
    } catch (err) {
      console.error("Firestore Update Failed:", err);
      // Helpful for debugging permissions
      if (err.code === 'permission-denied') {
        alert("Permission denied! Check your Firebase Rules.");
      }
    }
  };

  const toggleAllSets = () => {
    const allCurrentlyDone = exercise.sets.every(s => s.done);
    const updatedSets = exercise.sets.map(s => ({ ...s, done: !allCurrentlyDone }));
    safeUpdate({
      sets: updatedSets,
      completed: !allCurrentlyDone,
      edited: false
    });
  };

  const toggleUnfinished = () => {
    safeUpdate({
      edited: !exercise.edited,
      completed: false
    });
  };

  const toggleSet = (index) => {
    const sets = exercise.sets.map((s, i) => 
      i === index ? { ...s, done: !s.done } : s
    );
    const allDone = sets.every((s) => s.done);
    safeUpdate({ 
        sets, 
        completed: allDone, 
        edited: false 
    });
  };

  const handleUpdate = (index, field, delta) => {
    const sets = exercise.sets.map((s, i) =>
      i === index ? { ...s, [field]: Math.max(0, s[field] + delta) } : s
    );
    safeUpdate({ sets, edited: true, completed: false });
  };

  const cardStatus = exercise.completed ? "status-completed" : exercise.edited ? "status-edited" : "";

  return (
    <div className={`exercise-card ${cardStatus}`}>
      <div className="card-header">
        <div className="header-actions">
           <button 
            className={`flag-btn ${exercise.edited ? 'active-red' : ''}`}
            onClick={toggleUnfinished}
          >
            ⚠️
          </button>
          <h4>{exercise.name}</h4>
        </div>
        <button className="del-btn" onClick={async () => await deleteDoc(ref)}>✕</button>
      </div>

      <div className="compact-sets-list">
        {exercise.sets.map((s, i) => (
          <div key={i} className="compact-row">
            <input 
              type="checkbox" 
              className="mobile-checkbox" 
              checked={s.done} 
              onChange={() => toggleSet(i)} 
            />
            
            <div className="mini-stepper">
              <button onClick={() => handleUpdate(i, "reps", -1)}>-</button>
              <span>{s.reps}<small>R</small></span>
              <button onClick={() => handleUpdate(i, "reps", 1)}>+</button>
            </div>

            <div className="mini-stepper">
              <button onClick={() => handleUpdate(i, "weight", -2.5)}>-</button>
              <span>{s.weight}<small>kg</small></span>
              <button onClick={() => handleUpdate(i, "weight", 2.5)}>+</button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className={`finish-card-btn ${exercise.completed ? 'is-done' : ''}`}
        onClick={toggleAllSets}
      >
        {exercise.completed ? "✓ COMPLETED" : "MARK ALL DONE"}
      </button>
    </div>
  );
}