import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

function MasterPassword({ onUnlock }) {
  const [input, setInput] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");

  // Check if Master Password already exists in localStorage
  useEffect(() => {
    const savedHash = localStorage.getItem("masterPasswordHash");
    if (savedHash) {
      setIsRegistered(true);
    }
  }, []);

  const handleSubmit = () => {
    const savedHash = localStorage.getItem("masterPasswordHash");

    if (!isRegistered) {
      // First time → Save hash
      const hash = CryptoJS.SHA256(input).toString();
      localStorage.setItem("masterPasswordHash", hash);
      alert("Master Password set successfully ✅");
      onUnlock();
    } else {
      // Verify password
      const hash = CryptoJS.SHA256(input).toString();
      if (hash === savedHash) {
        onUnlock();
      } else {
        setError("❌ Wrong Master Password!");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">
        {isRegistered ? "Unlock Vault 🔐" : "Set Master Password 🔑"}
      </h1>
      <input
        type="password"
        placeholder="Enter Master Password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="px-4 py-2 rounded-lg text-black"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
      >
        {isRegistered ? "Unlock" : "Set Password"}
      </button>
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}

export default MasterPassword;
