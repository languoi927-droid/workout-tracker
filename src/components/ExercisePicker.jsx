import { useEffect, useState } from "react";
// Change: Import the library service that uses userCode
import { getExerciseTemplates } from "../lib/exerciseService"; 
import { addExerciseToSession } from "../lib/sessionExerciseService";

// Change: Receive userCode as a prop
export default function ExercisePicker({ sessionId, userCode }) {
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Change: Fetch the library SPECIFIC to this userCode
    if (userCode) {
      getExerciseTemplates(userCode).then(data => setExercises(data));
    }
  }, [userCode]);

  const bodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Abs", "Cardio"];

  const handleAdd = async (exercise) => {
    // Change: Pass userCode so it saves in the correct user folder
    await addExerciseToSession(userCode, sessionId, exercise);
    setActiveCategory(null);
  };

  return (
    <div className="picker-container">
      <h2 className="picker-title">Add Exercises</h2>

      <div className="category-grid">
        {bodyParts.map(bp => {
          const count = exercises.filter(e => e.bodyPart === bp).length;
          return (
            <button 
              key={bp} 
              className="category-tile" 
              onClick={() => setActiveCategory(bp)}
            >
              <span className="cat-icon">{getIcon(bp)}</span>
              <span className="cat-name">{bp}</span>
              <span className="cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      {activeCategory && (
        <>
          <div className="form-backdrop" onClick={() => setActiveCategory(null)} />
          <div className="form-overlay category-popup">
            <div className="popup-header">
              <h3>Select {activeCategory}</h3>
              <button className="close-popup" onClick={() => setActiveCategory(null)}>✕</button>
            </div>
            
            <div className="library-list-stack scrollable-list">
              {exercises
                .filter(e => e.bodyPart === activeCategory)
                .map(e => (
                  <div key={e.id} className="lib-list-item picker-item">
                    <div className="lib-item-info">
                      <strong>{e.name}</strong>
                      <div className="lib-item-meta">
                        <span>{e.sets} sets</span>
                        <span className="dot">•</span>
                        <span>{e.weight}kg</span>
                      </div>
                    </div>
                    <button 
                      className="picker-inline-add-btn" 
                      onClick={() => handleAdd(e)}
                    >
                      ＋ ADD
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getIcon(part) {
  const icons = { Chest: "💪", Back: "🧗", Legs: "🦵", Shoulders: "🏋️", Arms: "🥊", Abs: "🍫", Cardio: "🏃" };
  return icons[part] || "🔥";
}