// Manager.jsx
import { useState, useRef } from "react";
import { encryptData, decryptData } from "../utils/crypto";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function Manager({ masterPassword, onLock }) {
  const [entries, setEntries] = useState([]);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef();

  const handleSave = async () => {
    if (!website || !username || !password)
      return toast.error("Fill all fields!");

    const encrypted = await encryptData(password, masterPassword);
    const newEntry = { id: uuidv4(), website, username, ...encrypted };
    setEntries([...entries, newEntry]);

    setWebsite("");
    setUsername("");
    setPassword("");
    toast.success("Saved!");
  };

  const handleCopy = async (entry) => {
    const decrypted = await decryptData(entry, masterPassword);
    navigator.clipboard.writeText(decrypted);
    toast.success("Password copied!");
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
    toast.success("Deleted!");
  };

  return (
    <>
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]" />
      </div>

      <div className="p-4 mx-auto w-full max-w-4xl text-black">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-500 text-lg text-center font-bold">
          Your Own Password Manager
        </p>

        {/* Input Form */}
        <div className="flex flex-col p-4 gap-6 items-center">
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-3 text-black"
            type="text"
            name="website"
          />

          <div className="flex flex-col md:flex-row w-full justify-between gap-6">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-3 text-black"
              type="text"
              name="username"
            />

            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-3 text-black"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <span
                className="absolute right-[6px] top-[6px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  className="p-1"
                  width={30}
                  src={showPassword ? "/eyecross.png" : "/eye.png"}
                  alt="eye toggle"
                />
              </span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex justify-center items-center text-black font-semibold bg-green-500 rounded-full px-8 py-2 w-fit hover:bg-green-300 gap-2 border border-green-800"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              style={{ width: "25px", height: "25px" }}
            />
            Save
          </button>
        </div>

        {/* Password Table */}
        <div className="passwords mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
            Your Passwords
          </h2>

          {entries.length === 0 ? (
            <div className="text-center">No passwords to show</div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-green-500">
              <table className="table-auto w-full border-collapse text-left">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="border border-green-500 px-4 py-2">Site</th>
                    <th className="border border-green-500 px-4 py-2">
                      Username
                    </th>
                    <th className="border border-green-500 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-green-50">
                      <td className="border border-green-500 px-4 py-2 break-all">
                        <span>{entry.website}</span>
                      </td>
                      <td className="border border-green-500 px-4 py-2">
                        <span>{entry.username}</span>
                      </td>
                      <td className="border border-green-500 px-4 py-2 flex gap-2">
                        <span
                          className="cursor-pointer"
                          onClick={() => handleCopy(entry)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          />
                        </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lock Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onLock}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
          >
            Lock Vault
          </button>
        </div>
      </div>
    </>
  );
}
