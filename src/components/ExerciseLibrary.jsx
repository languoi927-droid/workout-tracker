import { useEffect, useState } from "react";
import { getExerciseTemplates, addExerciseTemplate, deleteExerciseTemplate, updateExerciseTemplate } from "../lib/exerciseService";
import ExerciseForm from "./ExerciseForm";

export default function ExerciseLibrary({ userCode }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { 
    if (userCode) load(); 
  }, [userCode]);

  const load = async () => { 
    setItems(await getExerciseTemplates(userCode)); 
  };

  const save = async (data) => {
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
    await deleteExerciseTemplate(userCode, id);
    load();
  };

  const bodyParts = ["Chest", "Triceps", "Peach", "Back", "Biceps", "Deltoids"];

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>Exercise Library</h2>
        <button className="add-main-btn" onClick={() => { setEditing(null); setShowForm(true); }}>
          ＋ New
        </button>
      </div>

      {/* 🔹 Added Search Bar */}
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search exercises..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <h3>{activeCategory}</h3>
              <button className="close-popup" onClick={() => setActiveCategory(null)}>✕</button>
            </div>
            
            <div className="library-list-stack scrollable-list">
              {filteredItems.filter(i => i.bodyPart === activeCategory).map(e => (
                // ... (inside the filteredItems.filter().map loop)
<div key={e.id} className="lib-list-item">
  <div className="lib-item-info">
    <strong>{e.name}</strong>
    <div className="lib-item-meta">
      {/* 🔹 Detailed Preview for the Library */}
      <div className="sets-preview-pills">
        {e.sets && e.sets.length > 0 ? (
          e.sets.map((s, idx) => (
            <span key={idx} className="mini-set-tag">
              {s.weight}k<small>x</small>{s.reps}
            </span>
          ))
        ) : (
          <span className="empty-msg">No sets configured</span>
        )}
      </div>
    </div>
  </div>
  <div className="lib-item-actions">
    <button onClick={() => { setEditing(e); setShowForm(true); setActiveCategory(null); }}>✏️</button>
    <button className="del-btn" onClick={() => remove(e.id)}>🗑️</button>
  </div>
</div>
              ))}
            </div>
          </div>
        </>
      )}

      {showForm && (
        <>
          <div className="form-backdrop" onClick={() => setShowForm(false)} />
          <div className="form-overlay">
            {/* Form now handles the sets array internally */}
            <ExerciseForm initial={editing} onSave={save} onCancel={() => {setShowForm(false); setEditing(null);}} />
          </div>
        </>
      )}
    </div>
  );
}

function getIcon(part) {
  const icons = {
    Chest: "💪",
    Triceps: "🔱",
    Peach: "🍑",
    Back: "🧗",
    Biceps: "🏋️",
    Deltoids: "🦾",
  };

  return icons[part] || "🔥";
}