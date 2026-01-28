import { useSessionExercises } from "../hooks/useSessionExercises";
import ExerciseInSession from "./ExerciseInSession";
import { finishSession } from "../lib/sessionService";
// Added userCode to props
export default function ActiveSession({ sessionId, userCode }) {
  
  // Pass both sessionId AND userCode to the hook
  const exercises = useSessionExercises(userCode, sessionId);
  console.log("Exercises Found:", exercises.length);
  const byBodyPart = exercises.reduce((acc, ex) => {
    const part = ex.bodyPart || "Other";
    acc[part] = acc[part] || [];
    acc[part].push(ex);
    return acc;
  }, {});
  // Calculate totals for the day
  const stats = exercises.reduce((acc, ex) => {
    ex.sets.forEach(s => {
      if (s.done) {
        acc.weight += (s.weight * s.reps);
        acc.sets += 1;
      }
    });
    return acc;
  }, { weight: 0, sets: 0 });
  const handleFinish = async () => {
    if (exercises.length === 0) return;
    if (window.confirm("Finish workout and save to history?")) {
      await finishSession(userCode, sessionId, stats);
      alert("Workout saved!");
      // Optionally redirect to Progress Tab
    }
  };
  return (
    <div className="active-session-page">
      <h2 className="session-title">Current Workout</h2>

      {exercises.length === 0 && (
        <div className="empty-session-state">
          <p>Tap a category above to add your first exercise!</p>
        </div>
      )}

      {Object.keys(byBodyPart).map(bp => (
        <div key={bp} className="body-part-group">
          <h3 className="body-part-header">{bp}</h3>

          <div className="horizontal-scroll-container">
            {byBodyPart[bp].map(ex => (
              <ExerciseInSession 
                key={ex.id} 
                exercise={ex} 
                sessionId={sessionId} 
                userCode={userCode} // Pass userCode down for updates/deletes
              />
            ))}
          </div>
        </div>
      ))}
      {exercises.length > 0 && (
        <div className="session-summary-card">
          <h3>Workout Summary</h3>
          <div className="stats-row">
            <div className="stat">
              <label>Volume</label>
              <p>{stats.weight} <small>kg</small></p>
            </div>
            <div className="stat">
              <label>Sets</label>
              <p>{stats.sets}</p>
            </div>
          </div>
          <button className="finish-session-btn" onClick={handleFinish}>
            🏁 Finish Workout
          </button>
        </div>
      )}
    </div>
  );
}