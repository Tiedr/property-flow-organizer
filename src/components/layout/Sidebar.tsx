
import { cn } from "@/lib/utils";
import { Table } from "lucide-react";

const Sidebar = () => {
  const navigation = [
    { name: "Estate Management", href: "/", icon: Table },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-estate-border">
      <div className="flex items-center h-16 px-6 border-b border-estate-border">
        <h1 className="text-xl font-bold text-estate-primary">Estate Manager</h1>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "bg-estate-accent text-estate-primary"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
