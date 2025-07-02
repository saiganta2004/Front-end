import { AuthProvider } from "./contexts/auth-context";
import { Inter } from "next/font/google";
import "./globals.css";
import ModernLayout from "./components/ModernLayout";
import BackgroundWallpaper from "./components/BackgroundWallpaper";
import SoftGradientBackground from "./components/SoftGradientBackground";

const inter = Inter({ subsets: ["latin"] });

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SoftGradientBackground />
        {/* <BackgroundWallpaper /> */}
        <AuthProvider>
          <ModernLayout>
            {children}
          </ModernLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
