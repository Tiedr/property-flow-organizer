
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-lg">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
