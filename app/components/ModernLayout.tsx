import SoftGradientBackground from "./SoftGradientBackground";

export default function ModernLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent">
      <SoftGradientBackground />
      <main className="w-full flex-1 flex flex-col items-center justify-center bg-transparent">
        {children}
      </main>
    </div>
  );
}
