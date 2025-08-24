import { useEffect, useState } from "react";
import { encryptData, decryptData } from "../utils/crypto";

const VAULT_CHECK_KEY = "vaultCheck"; // stores {ciphertext, iv, salt}

export default function VaultGate({ onUnlock }) {
  const [hasVault, setHasVault] = useState(false);
  const [mode, setMode] = useState("unlock"); // "unlock" | "create"
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const exists = !!localStorage.getItem(VAULT_CHECK_KEY);
    setHasVault(exists);
    setMode(exists ? "unlock" : "create");
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (pw.length < 8) return setError("Use at least 8 characters.");
    if (pw !== pw2) return setError("Passwords do not match.");

    const check = await encryptData("vault-ok", pw);
    localStorage.setItem(VAULT_CHECK_KEY, JSON.stringify(check));
    onUnlock(pw); // pass master password up
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError("");
    const raw = localStorage.getItem(VAULT_CHECK_KEY);
    if (!raw) return setError("Vault not initialized.");
    try {
      const ok = await decryptData(JSON.parse(raw), pw);
      if (ok === "vault-ok") onUnlock(pw);
      else setError("Wrong master password.");
    } catch {
      setError("Wrong master password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-600">
        {mode === "create" ? "Create Master Password" : "Unlock Vault"}
      </h2>
      <form onSubmit={mode === "create" ? handleCreate : handleUnlock} className="space-y-3">
        <input
          type="password"
          placeholder="Master password"
          className="w-full border rounded p-2"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        {mode === "create" && (
          <input
            type="password"
            placeholder="Confirm master password"
            className="w-full border rounded p-2"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded p-2"
        >
          {mode === "create" ? "Create & Unlock" : "Unlock"}
        </button>

        {hasVault && mode === "unlock" && (
          <button
            type="button"
            onClick={() => setMode("create")}
            className="text-xs text-gray-500 underline block mx-auto mt-1"
          >
            Reset vault (danger)
          </button>
        )}
      </form>
      {mode === "create" && (
        <p className="text-xs text-gray-500 mt-3">
          Your master password is never stored. It derives an encryption key in your browser. Don’t forget it!
        </p>
      )}
    </div>
  );
}
