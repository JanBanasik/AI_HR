
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Settings, 
  PieChart, 
  FilePlus,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    title: "Add Candidate",
    icon: FilePlus,
    path: "/add-candidate",
  },
  {
    title: "Interviews",
    icon: CalendarDays,
    path: "/interviews",
  },
  {
    title: "Reports",
    icon: PieChart,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-[calc(100vh-4rem)] transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.path
                  ? "bg-cvision-purple-light text-cvision-purple"
                  : "text-gray-600 hover:bg-gray-100",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="p-4">
          {!collapsed && (
            <div className="bg-cvision-purple-light rounded-lg p-4 text-sm">
              <p className="font-medium text-cvision-purple mb-2">Need help?</p>
              <p className="text-gray-600 mb-3">Check our documentation for tips on using CVision effectively.</p>
              <Button variant="outline" size="sm" className="w-full border-cvision-purple text-cvision-purple">
                <Link to="/documentation">
                  View Docs
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
