import { useState, useEffect } from "react";

export default function ExerciseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    bodyPart: "Chest",
    sets: 3,
    reps: 10,
    weight: 0,
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    // Convert numbers correctly if they are numeric inputs
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const submit = (e) => {
    e.preventDefault(); // Prevent accidental page reloads
    if (!form.name) return alert("Please enter an exercise name");
    onSave(form);
  };

  return (
    <form className="exercise-form" onSubmit={submit}>
      <div className="field-group">
        <label>Exercise Name</label>
        <input
          name="name"
          placeholder="e.g. Incline Bench Press"
          value={form.name}
          onChange={handleChange}
          autoFocus
        />
      </div>

      <div className="field-group">
        <label>Category</label>
        <select name="bodyPart" value={form.bodyPart} onChange={handleChange}>
          <option>Chest</option>
          <option>Back</option>
          <option>Legs</option>
          <option>Shoulders</option>
          <option>Arms</option>
          <option>Abs</option>
          <option>Cardio</option>
        </select>
      </div>

      {/* Row for Sets and Reps */}
      <div className="form-row">
        <div className="field-group">
          <label>Sets</label>
          <input
            name="sets"
            type="number"
            inputMode="numeric"
            value={form.sets}
            onChange={handleChange}
          />
        </div>
        <div className="field-group">
          <label>Reps</label>
          <input
            name="reps"
            type="number"
            inputMode="numeric"
            value={form.reps}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field-group">
        <label>Weight (kg)</label>
        <input
          name="weight"
          type="number"
          inputMode="decimal"
          value={form.weight}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {initial ? "Update Exercise" : "Save Exercise"}
        </button>
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}