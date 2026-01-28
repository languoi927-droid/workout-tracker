import { useState, useEffect, useMemo } from "react";
import { getWorkoutHistory } from "../lib/progressService";
import ProgressChart from "./ProgressChart";
export default function ProgressTab({ userCode }) {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExercise, setSelectedExercise] = useState("All");

  useEffect(() => {
    loadHistory();
  }, [startDate, endDate, userCode]);

  const loadHistory = async () => {
    const data = await getWorkoutHistory(userCode, startDate, endDate);
    setHistory(data);
  };

  // 🔹 UseMemo to calculate totals without re-running on every render
  const totals = useMemo(() => {
    const filtered = selectedExercise === "All" ? history : history.filter(h => h.name === selectedExercise);
    
    let totalKg = 0;
    let maxWeight = 0;
    
    filtered.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.done) {
          totalKg += (s.weight * s.reps);
          if (s.weight > maxWeight) maxWeight = s.weight;
        }
      });
    });

    return { totalKg, maxWeight, count: filtered.length };
  }, [history, selectedExercise]);

  const exerciseNames = ["All", ...new Set(history.map(h => h.name))];
  const filteredHistory = selectedExercise === "All" 
    ? history 
    : history.filter(h => h.name === selectedExercise);

  return (
    <div className="progress-container">
      <header className="progress-header">
        <div className="filter-section">
          <div className="date-row">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>→</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <select className="ex-filter" value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
            {exerciseNames.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        {/* 🔹 NEW: Quick Stats Summary */}
        <div className="summary-grid">
          <div className="summary-card">
            <small>Total Volume</small>
            <strong>{totals.totalKg.toLocaleString()} <small>kg</small></strong>
          </div>
          <div className="summary-card">
            <small>Personal Record</small>
            <strong>{totals.maxWeight} <small>kg</small></strong>
          </div>
        </div>
        {selectedExercise !== "All" && (
  <div className="chart-container">
    <h4>{selectedExercise} Strength Trend</h4>
    <ProgressChart data={history} exerciseName={selectedExercise} />
  </div>
)}
      </header>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">No data for this period. Keep lifting! 🏋️</div>
        ) : (
          filteredHistory.sort((a,b) => b.date.localeCompare(a.date)).map((entry, idx) => (
            <div key={idx} className="progress-history-card">
              <div className="card-top">
                <span className={`body-tag ${entry.bodyPart?.toLowerCase()}`}>{entry.bodyPart}</span>
                <span className="date-text">{new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
              <h4>{entry.name}</h4>
              <div className="sets-row">
                {entry.sets.map((s, i) => (
                  <div key={i} className={`set-pill ${s.done ? 'done' : ''}`}>
                    {s.weight}k × {s.reps}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}