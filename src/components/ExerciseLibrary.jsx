import { useEffect, useState } from "react";
import { getExerciseTemplates, addExerciseTemplate, deleteExerciseTemplate, updateExerciseTemplate } from "../lib/exerciseService";
import ExerciseForm from "./ExerciseForm";

// Change: Receive userCode as a prop
export default function ExerciseLibrary({ userCode }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Change: Reload if userCode changes
  useEffect(() => { 
    if (userCode) load(); 
  }, [userCode]);

  // Change: Pass userCode to the service
  const load = async () => { 
    setItems(await getExerciseTemplates(userCode)); 
  };

  const save = async (data) => {
    // Change: Pass userCode to save/update functions
    if (editing) { 
      await updateExerciseTemplate(userCode, editing.id, data); 
    } else { 
      await addExerciseTemplate(userCode, data); 
    }
    setEditing(null);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;
    // Change: Pass userCode to delete function
    await deleteExerciseTemplate(userCode, id);
    load();
  };

  const bodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Abs", "Cardio"];

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>Library</h2>
        <button className="add-main-btn" onClick={() => { setEditing(null); setShowForm(true); }}>
          ＋ New
        </button>
      </div>

      <div className="category-grid">
        {bodyParts.map(bp => (
          <button key={bp} className="category-tile" onClick={() => setActiveCategory(bp)}>
            <span className="cat-icon">{getIcon(bp)}</span>
            <span className="cat-name">{bp}</span>
            <span className="cat-count">
              {items.filter(i => i.bodyPart === bp).length}
            </span>
          </button>
        ))}
      </div>

      {activeCategory && (
        <>
          <div className="form-backdrop" onClick={() => setActiveCategory(null)} />
          <div className="form-overlay category-popup">
            <div className="popup-header">
              <h3>{activeCategory} Exercises</h3>
              <button className="close-popup" onClick={() => setActiveCategory(null)}>✕</button>
            </div>
            
            <div className="library-list-stack scrollable-list">
              {items.filter(i => i.bodyPart === activeCategory).map(e => (
                <div key={e.id} className="lib-list-item">
                  <div className="lib-item-info">
                    <strong>{e.name}</strong>
                    <div className="lib-item-meta">
                      <span>{e.sets}×{e.reps}</span>
                      <span className="dot">•</span>
                      <span>{e.weight}kg</span>
                    </div>
                  </div>
                  <div className="lib-item-actions">
                    <button onClick={() => { setEditing(e); setShowForm(true); setActiveCategory(null); }}>✏️</button>
                    <button className="del-btn" onClick={() => remove(e.id)}>🗑️</button>
                  </div>
                </div>
              ))}
              {items.filter(i => i.bodyPart === activeCategory).length === 0 && (
                <p className="empty-msg">No exercises added yet.</p>
              )}
            </div>
          </div>
        </>
      )}

      {showForm && (
        <>
          <div className="form-backdrop" onClick={() => setShowForm(false)} />
          <div className="form-overlay">
            <ExerciseForm initial={editing} onSave={save} onCancel={() => {setShowForm(false); setEditing(null);}} />
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