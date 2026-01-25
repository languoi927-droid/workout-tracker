import { useEffect, useState } from "react";
import ExercisePicker from "./components/ExercisePicker";
import ActiveSession from "./components/ActiveSession";
import ExerciseLibrary from "./components/ExerciseLibrary";
import Login from "./components/Login";
import { getOrCreateTodaySession } from "./lib/sessionService";

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workout");
  const [userCode, setUserCode] = useState(localStorage.getItem("userCode"));

  useEffect(() => {
    if (!userCode) {
      setLoading(false);
      return;
    }

    async function init() {
      setLoading(true);
      try {
        const session = await getOrCreateTodaySession(userCode);
        setSessionId(session.id);
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [userCode]);

  const handleLogout = () => {
    localStorage.removeItem("userCode");
    window.location.reload();
  };

  if (!userCode) return <Login onLogin={setUserCode} />;
  if (loading) return <div className="loader">Loading Session...</div>;

  return (
    <div className="app-viewport">
      <main className="content-container">
        {activeTab === "workout" ? (
          <div className="tab-content">
            <header className="header-meta">
              <div className="header-top">
                <span>Today's Workout</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Exit ({userCode})
                </button>
              </div>
              <small>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</small>
            </header>

            {sessionId && (
              <>
                {/* 1. Pass userCode to the Picker */}
                <ExercisePicker sessionId={sessionId} userCode={userCode} />
                
                {/* 2. Pass sessionId (date) to the Active Session */}
                <ActiveSession sessionId={sessionId} userCode={userCode} />
              </>
            )}
          </div>
        ) : (
          <div className="tab-content">
            {/* 3. Pass userCode to the Library */}
            <ExerciseLibrary userCode={userCode} />
          </div>
        )}
      </main>

      <nav className="bottom-tab-bar">
        <button 
          className={`tab-item ${activeTab === "workout" ? "active" : ""}`}
          onClick={() => setActiveTab("workout")}
        >
          <span className="tab-icon">🏋️</span>
          <span className="tab-label">Workout</span>
        </button>
        
        <button 
          className={`tab-item ${activeTab === "library" ? "active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-label">Library</span>
        </button>
      </nav>
    </div>
  );
}