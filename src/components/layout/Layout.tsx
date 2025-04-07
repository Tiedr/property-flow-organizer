
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for theme in localStorage
    const savedTheme = localStorage.getItem("ughoron-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Listen for theme changes
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem("ughoron-theme") as "light" | "dark" | null;
      if (currentTheme) {
        setTheme(currentTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for theme changes within the app
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };
    
    window.addEventListener("themeChange" as any, handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange" as any, handleThemeChange);
    };
  }, []);

  const darkModeStyles = {
    backgroundImage: `
      linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ea384c' fill-opacity='0.1'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E"),
      radial-gradient(circle at 25% 25%, rgba(234, 56, 76, 0.2) 2%, transparent 12%),
      radial-gradient(circle at 75% 75%, rgba(234, 56, 76, 0.3) 2%, transparent 12%),
      radial-gradient(circle at 45% 55%, rgba(255, 255, 255, 0.1) 3%, transparent 15%)
    `,
    backgroundSize: "cover, 120px 120px, 200px 200px, 200px 200px, 300px 300px",
    backgroundPosition: "center, 0 0, 0 0, 0 0, 0 0",
    backgroundRepeat: "no-repeat, repeat, repeat, repeat, repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#111"
  };

  const lightModeStyles = {
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23ea384c' fill-opacity='0.3'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E"),
      linear-gradient(135deg, rgba(234, 56, 76, 0.3) 0%, rgba(234, 56, 76, 0.1) 100%)
    `,
    backgroundSize: "cover, 120px 120px, cover",
    backgroundPosition: "center, 0 0, center",
    backgroundRepeat: "no-repeat, repeat, no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#fff"
  };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={theme === "dark" ? darkModeStyles : lightModeStyles}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/30 light-mode:bg-white/30" style={{ zIndex: 0 }}></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in max-w-[1800px] w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-white/60 light-mode:text-black/60 border-t border-white/10 light-mode:border-black/10">
          <span>© {new Date().getFullYear()} UGHORON. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
