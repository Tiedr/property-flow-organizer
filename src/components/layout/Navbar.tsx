import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const { user, signOut, isAdmin, isLoading, session } = useAuth();
  const isAuthenticated = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-indigo-950 to-blue-950 border-b border-slate-800">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Logo />
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <NavLink 
                to="/"
                end
                className={({ isActive }) => 
                  isActive 
                    ? "text-white font-medium border-b-2 border-indigo-400 pb-1" 
                    : "text-slate-300 hover:text-white transition-colors"
                }
              >
                Estates
              </NavLink>
              <NavLink 
                to="/clients"
                className={({ isActive }) => 
                  isActive 
                    ? "text-white font-medium border-b-2 border-indigo-400 pb-1" 
                    : "text-slate-300 hover:text-white transition-colors"
                }
              >
                Clients
              </NavLink>
              {/* Add more navigation items here */}
            </nav>
          )}
        </div>

        <div className="flex items-center">
          {isLoading ? (
            <span className="text-white">Loading...</span>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "Avatar"} />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isAdmin ? "Administrator" : "User"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => window.location.href = '/users'}>
                    User Management
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => window.location.href = '/promote-admin'}>
                  Promote to Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => window.location.href = '/auth'}>Login</Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the application.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <NavLink 
                  to="/"
                  end
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${isActive ? 'bg-accent text-accent-foreground' : ''}`
                  }
                >
                  Estates
                </NavLink>
                <NavLink 
                  to="/clients"
                  className={({ isActive }) => 
                    `block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${isActive ? 'bg-accent text-accent-foreground' : ''}`
                  }
                >
                  Clients
                </NavLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* <div className={`md:hidden bg-gray-900 ${isMobileMenuOpen ? 'block' : 'none'}`}>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="/"
            className="block text-white hover:bg-gray-800 p-2 rounded"
          >
            Estates
          </NavLink>
          <NavLink
            to="/clients"
            className="block text-white hover:bg-gray-800 p-2 rounded"
          >
            Clients
          </NavLink>
        </nav>
      </div> */}
    </div>
  );
};

export default Navbar;
