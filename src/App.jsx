// src/App.jsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import CryptoTest from "./components/CryptoTest";
import VaultGate from "./components/VaultGate";

export default function App() {
  const [masterPassword, setMasterPassword] = useState(null);
  const [showPlayground, setShowPlayground] = useState(false);

  // Auto-lock after 5 minutes of inactivity
  useEffect(() => {
    if (!masterPassword) return;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setMasterPassword(null), 5 * 60 * 1000);
    };
    const handlers = ["mousemove", "keydown", "click", "visibilitychange"];
    handlers.forEach((ev) => window.addEventListener(ev, reset));
    reset();
    return () => {
      clearTimeout(timer);
      handlers.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [masterPassword]);

  return (
    <div className="bg-green-50 min-h-screen flex flex-col">
      {/* Top bar (now also controls playground) */}
      <Navbar onOpenPlayground={() => setShowPlayground(true)} />

      {/* Main area with green grid background */}
      <main className="flex-1 bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="max-w-5xl mx-auto p-4">
          {!masterPassword ? (
            <VaultGate onUnlock={setMasterPassword} />
          ) : (
            <Manager
              masterPassword={masterPassword}
              onLock={() => setMasterPassword(null)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over panel for Crypto Playground */}
      {showPlayground && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowPlayground(false)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
            <div className="border-b px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span role="img" aria-label="lab">🧪</span>
                Crypto Playground (Test Only)
              </h2>
              <button
                onClick={() => setShowPlayground(false)}
                className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-auto">
              <CryptoTest />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
