"use client";
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full z-[-10] pointer-events-none animate-gradient bg-gradient-to-r from-indigo-700 via-blue-500 to-teal-400 opacity-30 blur-2xl"
      aria-hidden="true"
    />
  );
}
