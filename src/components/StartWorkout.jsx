import { useEffect, useState } from "react";
import { getExerciseTemplates } from "../lib/exerciseService";
import { startSession, getActiveSession } from "../lib/sessionService";

export default function StartWorkout({ onStarted }) {
  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    getExerciseTemplates().then(setExercises);
    getActiveSession().then(setSession);
  }, []);

  const begin = async () => {
    const doc = await startSession();
    setSession({ id: doc.id });
    onStarted(doc.id);
  };

  if (session) {
    return <button onClick={() => onStarted(session.id)}>Resume Workout</button>;
  }

  return (
    <div className="card">
      <h2>Start Workout</h2>
      <button onClick={begin}>Start New Workout</button>
    </div>
  );
}
