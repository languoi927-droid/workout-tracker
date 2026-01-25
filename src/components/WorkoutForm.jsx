import { useState, useEffect } from "react";
import { addSet } from "../lib/workoutService";
import { getExercises, addExercise } from "../lib/exerciseService";

export default function WorkoutForm() {
  const today = new Date().toISOString().slice(0, 10);

  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({
    date: today,
    bodyPart: "Chest",
    exercise: "",
    reps: "",
    weight: "",
  });

  // Load remembered exercises
    useEffect(() => {
        getExercises().then(setExercises);
    }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSet = async () => {
    if (!form.exercise || !form.reps || !form.weight) {
      alert("Please fill all fields");
      return;
    }

    // Find or create exercise
    const existing = exercises.find(
      (e) => e.name.toLowerCase() === form.exercise.toLowerCase()
    );

    let exerciseId;

    if (!existing) {
      const doc = await addExercise(form.exercise, form.bodyPart);
      exerciseId = doc.id;
      setExercises([
        ...exercises,
        {
          id: exerciseId,
          name: form.exercise,
          bodyPart: form.bodyPart,
        },
      ]);
    } else {
      exerciseId = existing.id;
    }

    // Save the set
    await addSet({
      date: form.date,
      bodyPart: form.bodyPart,
      exerciseId,
      exerciseName: form.exercise,
      reps: Number(form.reps),
      weight: Number(form.weight),
    });

    // Reset fast-entry fields
    setForm({ ...form, reps: "", weight: "" });
  };

  return (
    <div className="card">
      <h2>Log Set</h2>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <select
        name="bodyPart"
        value={form.bodyPart}
        onChange={handleChange}
      >
        <option>Chest</option>
        <option>Back</option>
        <option>Legs</option>
        <option>Shoulders</option>
        <option>Arms</option>
      </select>

      <input
        list="exercise-list"
        name="exercise"
        value={form.exercise}
        onChange={handleChange}
        placeholder="Exercise"
      />

      <datalist id="exercise-list">
        {exercises
          .filter((e) => e.bodyPart === form.bodyPart)
          .map((e) => (
            <option key={e.id} value={e.name} />
          ))}
      </datalist>

      <input
        name="reps"
        type="number"
        inputMode="numeric"
        placeholder="Reps"
        value={form.reps}
        onChange={handleChange}
      />

      <input
        name="weight"
        type="number"
        inputMode="numeric"
        placeholder="Weight (kg)"
        value={form.weight}
        onChange={handleChange}
      />

      <button onClick={saveSet}>Save Set</button>
    </div>
  );
}
