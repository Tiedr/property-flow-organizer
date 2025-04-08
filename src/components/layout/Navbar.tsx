
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, User, LogOut, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();
  
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
        <Search className="absolute left-3 top-3 h-4 w-4 text-white" />
        <Input
          placeholder="Search clients, projects..."
          className="pl-9 glass-input h-10 rounded-full text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full w-10 h-10 p-2 glass-input">
              <User className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-input glass-card w-56 mr-2 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex cursor-pointer items-center text-slate-200">
              <User className="mr-2 h-4 w-4" />
              <span>{user?.email}</span>
            </DropdownMenuItem>
            {isAdmin && (
              <Link to="/users">
                <DropdownMenuItem className="flex cursor-pointer items-center text-slate-200">
                  <Users className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex cursor-pointer items-center text-slate-200" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
