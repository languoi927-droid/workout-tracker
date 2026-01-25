import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login({ onLogin }) {
  const [code, setCode] = useState("");

  const handleLogin = async () => {
    if (code.length < 3) return alert("Code too short");
    const cleanCode = code.toLowerCase().trim();
    const userRef = doc(db, "users", cleanCode);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // Register new code automatically
      await setDoc(userRef, { createdAt: new Date(), code: cleanCode });
    }
    
    localStorage.setItem("userCode", cleanCode);
    onLogin(cleanCode);
  };

  return (
    <div className="login-screen">
      <h1>Fitness Pro</h1>
      <p>Enter your personal access code</p>
      <input 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        placeholder="ex: john65"
      />
      <button className="save-btn" onClick={handleLogin}>Enter App</button>
    </div>
  );
}