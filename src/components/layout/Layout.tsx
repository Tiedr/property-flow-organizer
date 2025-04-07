
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
    backgroundImage: `url('/lovable-uploads/de0945d4-540b-4f7d-bab7-896cc83f8657.png'), 
                        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1%, transparent 8%), 
                        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1%, transparent 8%)`,
    backgroundSize: "cover, 60px 60px, 60px 60px",
    backgroundPosition: "center, 0 0, 30px 30px",
    backgroundRepeat: "no-repeat, repeat, repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#111"
  };

  const lightModeStyles = {
    backgroundImage: `linear-gradient(135deg, #ea384c22 10%, #ffffff 100%), 
                       radial-gradient(circle at 25% 25%, rgba(234, 56, 76, 0.2) 1%, transparent 8%), 
                       radial-gradient(circle at 75% 75%, rgba(234, 56, 76, 0.2) 1%, transparent 8%)`,
    backgroundSize: "cover, 60px 60px, 60px 60px",
    backgroundPosition: "center, 0 0, 30px 30px",
    backgroundRepeat: "no-repeat, repeat, repeat",
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
