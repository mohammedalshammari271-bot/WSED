/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Home, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  currentScreen: "home" | "practice" | "results";
  theme: "light" | "dark";
  onNavigate: (screen: "home" | "practice" | "results") => void;
  onToggleTheme: () => void;
}

export default function Navbar({
  currentScreen,
  theme,
  onNavigate,
  onToggleTheme,
}: NavbarProps) {
  const [logoError, setLogoError] = useState(false);

  const LOGO_SRC = "brand/madrasati-logo.jpg";
  const FALLBACK_SVG =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='100%' height='100%' fill='%235B2596' rx='8'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='11' font-weight='bold'>مدرسي</text></svg>";

  return (
    <nav className="bg-theme-card border-b border-theme-border py-3 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => onNavigate("home")}
      >
        <img
          className="w-10 h-10 object-contain rounded-lg shadow-sm"
          src={logoError ? FALLBACK_SVG : LOGO_SRC}
          alt="تطبيق مدرسي"
          onError={() => setLogoError(true)}
        />
        <span className="text-xl font-extrabold text-theme-primary tracking-tight font-sans">
          تطبيق مدرسي
        </span>
      </div>

      <div className="flex items-center gap-3">
        {currentScreen !== "home" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-theme-card border border-theme-border text-theme-text-main font-semibold py-2 px-4 rounded-lg hover:bg-theme-bg hover:text-theme-primary transition-colors cursor-pointer text-sm"
            onClick={() => onNavigate("home")}
          >
            <Home size={16} strokeWidth={2.5} />
            الرئيسية
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-card border border-theme-border hover:bg-theme-bg text-theme-text-main hover:text-theme-primary transition-colors cursor-pointer"
          onClick={onToggleTheme}
          title="تبديل الوضع الليلي والنهاري"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-amber-400" />
          ) : (
            <Moon size={20} className="text-slate-700" />
          )}
        </motion.button>
      </div>
    </nav>
  );
}
