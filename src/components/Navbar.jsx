import React from "react";

const Navbar = ({ onOpenPlayground }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4 h-16">
        
        {/* Logo */}
        <div className="logo font-bold text-2xl tracking-wide">
          <span className="text-emerald-400">&lt;</span>
          <span>Lock</span>
          <span className="text-emerald-400">OP/&gt;</span>
        </div>

        {/* Crypto Playground Button */}
        <button
          onClick={onOpenPlayground}
          className="text-white font-bold bg-emerald-600 rounded-full px-8 py-2 w-fit hover:bg-green-300 gap-2 border border-green-800"
          >
          <span role="img" aria-label="lab"></span>
          <span>🔑Password Tester</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
