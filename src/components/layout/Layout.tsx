
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background backdrop-blur-lg bg-gradient-to-br from-black/90 to-black/60">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in max-w-[1800px] w-full mx-auto">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-estate-border">
        <span>© {new Date().getFullYear()} UGHORON DB. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Layout;
