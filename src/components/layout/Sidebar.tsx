
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  FileSpreadsheet, 
  Calendar
} from "lucide-react";

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderTree },
    { name: "Documents", href: "/dashboard", icon: FileSpreadsheet },
    { name: "Schedule", href: "/dashboard", icon: Calendar },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-estate-border">
      <div className="flex items-center h-16 px-6 border-b border-estate-border">
        <h1 className="text-xl font-bold text-estate-primary">PropertyFlow</h1>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-estate-accent text-estate-primary" 
                  : "text-estate-text hover:bg-estate-background"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
