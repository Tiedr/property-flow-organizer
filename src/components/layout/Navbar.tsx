
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="border-b border-estate-border bg-white p-4 flex items-center justify-between">
      <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-estate-muted" />
        <Input
          placeholder="Search clients, projects..."
          className="pl-9 bg-estate-background border-estate-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex items-center ml-auto space-x-4">
        <Button variant="ghost" className="p-2">
          <User className="h-5 w-5 text-estate-muted" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
