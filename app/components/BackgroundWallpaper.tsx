"use client"

export default function BackgroundWallpaper() {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[-10] opacity-10 blur-xl animate-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hidden sm:block pointer-events-none select-none"
      aria-hidden="true"
    />
  )
}
