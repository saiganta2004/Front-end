"use client";
import { useState } from "react";
import { Cog } from "lucide-react";

export default function BackgroundSettings() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="glass-panel rounded-full p-3 shadow-lg hover:bg-blue-100 transition"
        onClick={() => setOpen(o => !o)}
        aria-label="Background settings"
      >
        <Cog className="w-6 h-6 text-blue-700" />
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 glass-panel rounded-xl shadow-lg p-4 min-w-[200px]">
          <div className="font-semibold mb-2">Background Settings</div>
          <div className="text-sm text-gray-600">Coming soon...</div>
        </div>
      )}
    </div>
  );
}