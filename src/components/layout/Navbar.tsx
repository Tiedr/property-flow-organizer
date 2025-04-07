
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/layout/Logo";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search functionality",
        description: "Search will be implemented in the next version.",
      });
    }
  };

  return (
    <div className="apple-nav sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Logo size="sm" />
      </div>
      
      <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block mx-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-white light-mode:text-black" />
        <Input
          placeholder="Search clients, projects..."
          className="pl-9 glass-input h-10 rounded-full text-black light-mode:text-black light-mode:placeholder:text-black/70"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button variant="ghost" className="rounded-full w-10 h-10 p-2 glass-input">
          <User className="h-5 w-5 text-white light-mode:text-black" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
