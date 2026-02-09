import { Outlet } from "react-router-dom";
import Navbar from './../components/ui/Navbar';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import bgDark from '../../public/bg.png.png';
import bgLight from '../../public/bg.light.png.png';

export default function MainLayout() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';
  const currentBgImage = isDarkMode ? bgDark : bgLight;

  const imgEffects = isDarkMode
    ? "opacity-80"
    : "opacity-100 brightness-[0.7]";

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-black transition-colors duration-500 overflow-hidden">

      <div
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ${imgEffects}`}
        style={{ backgroundImage: `url(${currentBgImage})` }}
      ></div>

      <div className="relative z-10 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />

        <div className="flex">
          <main className="pt-32 min-h-screen container mx-auto px-4">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  );
}