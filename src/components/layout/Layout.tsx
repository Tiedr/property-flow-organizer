
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const backgroundStyles = {
    backgroundImage: `
      url("/lovable-uploads/56c7d5b6-e735-4be3-8e41-b6832c066c9f.png")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#111"
  };

  return (
    <div className="flex flex-col min-h-screen" style={backgroundStyles}>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 mt-16 overflow-auto animate-fade-in max-w-[1800px] w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-white/70 border-t border-white/10">
          <span>© {new Date().getFullYear()} UGHORON. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
