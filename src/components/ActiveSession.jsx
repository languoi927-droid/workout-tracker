import { useSessionExercises } from "../hooks/useSessionExercises";
import ExerciseInSession from "./ExerciseInSession";

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
    </div>
  );
}