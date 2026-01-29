import { useState, useEffect } from "react";

export default function ExerciseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    bodyPart: "Chest",
    sets: [] // Now an array of { reps, weight }
  });

  // Helper to generate a default set array
  const createDefaultSets = (count, reps = 10, weight = 0) => 
    Array.from({ length: count }, () => ({ reps, weight, done: false }));

  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      // Default state for new exercise: 4 sets
      setForm(prev => ({ ...prev, sets: createDefaultSets(4) }));
    }
  }, [initial]);

  const handleNameChange = (e) => setForm({ ...form, name: e.target.value });
  const handleBodyPartChange = (e) => setForm({ ...form, bodyPart: e.target.value });

  // When user changes the "Set Count" number input
  const handleSetCountChange = (newCount) => {
    const count = Math.max(1, Number(newCount));
    let updatedSets = [...form.sets];

    if (count > updatedSets.length) {
      // Add more sets (copying values from the last set)
      const lastSet = updatedSets[updatedSets.length - 1] || { reps: 10, weight: 0 };
      const extra = Array.from({ length: count - updatedSets.length }, () => ({ ...lastSet, done: false }));
      updatedSets = [...updatedSets, ...extra];
    } else {
      // Remove sets from the end
      updatedSets = updatedSets.slice(0, count);
    }
    setForm({ ...form, sets: updatedSets });
  };

  // Update a specific set's reps or weight
  const handleIndividualSetChange = (index, field, value) => {
    const updatedSets = form.sets.map((s, i) => 
      i === index ? { ...s, [field]: Number(value) } : s
    );
    setForm({ ...form, sets: updatedSets });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Please enter an exercise name");
    onSave(form);
  };

  return (
    <form className="exercise-form" onSubmit={submit}>
      <div className="field-group">
        <label>Exercise Name</label>
        <input name="name" value={form.name} onChange={handleNameChange} autoFocus />
      </div>

      <div className="form-row">
        <div className="field-group">
          <label>Category</label>
          <select value={form.bodyPart} onChange={handleBodyPartChange}>
            <option>Chest</option>
<option>Triceps</option>
<option>Peach</option>
<option>Back</option>
<option>Biceps</option>
<option>Deltoids</option>
          </select>
        </div>
        <div className="field-group">
          <label>Number of Sets</label>
          <input 
            type="number" 
            value={form.sets.length} 
            onChange={(e) => handleSetCountChange(e.target.value)} 
          />
        </div>
      </div>

      <div className="sets-editor-zone">
        <label>Customize Sets (Optional)</label>
        {form.sets.map((set, i) => (
          <div key={i} className="set-edit-row">
            <span>Set {i + 1}</span>
            <input 
              type="number" 
              placeholder="Reps" 
              value={set.reps} 
              onChange={(e) => handleIndividualSetChange(i, "reps", e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="kg" 
              value={set.weight} 
              onChange={(e) => handleIndividualSetChange(i, "weight", e.target.value)} 
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {initial ? "Update Template" : "Add to Library"}
        </button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}