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
      url("/lovable-uploads/56c7d5b6-e735-4be3-8e41-b6832c066c9f.png")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#111"
  };

  const lightModeStyles = {
    backgroundImage: `
      url("/lovable-uploads/56c7d5b6-e735-4be3-8e41-b6832c066c9f.png")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#fff"
  };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={theme === "dark" ? darkModeStyles : lightModeStyles}
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in max-w-[1800px] w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-white/70 light-mode:text-black/70 border-t border-white/10 light-mode:border-black/10">
          <span>© {new Date().getFullYear()} UGHORON. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
