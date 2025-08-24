import { useState } from "react";

export default function CryptoTest() {
  const [text, setText] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");

  // Encrypt with Base64 (demo only, not secure)
  const encrypt = () => {
    if (text.trim() === "") {
      alert("Enter some text first!");
      return;
    }
    setEncrypted(btoa(text));
  };

  // Decrypt with Base64
  const decrypt = () => {
    if (!encrypted) {
      alert("Encrypt something first!");
      return;
    }
    try {
      setDecrypted(atob(encrypted));
    } catch (err) {
      alert("Invalid encrypted text!");
    }
  };

  return (

    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">

      <h2 className="text-xl font-bold mb-4 text-green-600">🔐 Test Encryption</h2>

      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded mb-3"
      />

      <div className="flex gap-3 mb-4">
        <button
          onClick={encrypt}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Encrypt
        </button>
        <button
          onClick={decrypt}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Decrypt
        </button>
      </div>

      {encrypted && (
        <p className="text-sm mb-2">
          <span className="font-semibold">Encrypted:</span> {encrypted}
        </p>
      )}

      {decrypted && (
        <p className="text-sm">
          <span className="font-semibold">Decrypted:</span> {decrypted}
        </p>
      )}

      <p className="text-gray-600 mt-2">
        This is a demo tool where you can type any text and see how encryption works.
        It does not affect your saved passwords.
      </p>
    </div>
  );
}
