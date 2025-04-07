
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div 
      className="flex flex-col min-h-screen bg-cover bg-center bg-fixed" 
      style={{ 
        backgroundImage: "url('/lovable-uploads/de0945d4-540b-4f7d-bab7-896cc83f8657.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" style={{ zIndex: 0 }}></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in max-w-[1800px] w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-white/60 border-t border-white/10">
          <span>© {new Date().getFullYear()} UGHORON DB. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
