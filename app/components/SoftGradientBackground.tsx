"use client"

export default function SoftGradientBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none select-none w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute w-[80vw] h-[80vw] top-[-20vw] left-[-20vw] bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-70 rounded-full blur-3xl animate-gradient-move" />
      <div className="absolute w-[60vw] h-[60vw] bottom-[-10vw] right-[-10vw] bg-gradient-to-tr from-yellow-200 via-pink-200 to-purple-200 opacity-60 rounded-full blur-3xl animate-gradient-move2" />
      <div className="absolute w-[50vw] h-[50vw] top-[30vh] left-[40vw] bg-gradient-to-tl from-green-200 via-blue-200 to-purple-200 opacity-50 rounded-full blur-3xl animate-gradient-move3" />
    </div>
  )
}
