
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, User, LogOut, Settings, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "candidate" | "interview" | "system";
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Candidate Applied",
    message: "John Doe applied for Frontend Developer position",
    time: "5 minutes ago",
    read: false,
    type: "candidate"
  },
  {
    id: "2",
    title: "Interview Scheduled",
    message: "You have an interview with Sarah Smith at 2:00 PM tomorrow",
    time: "1 hour ago",
    read: false,
    type: "interview"
  },
  {
    id: "3",
    title: "Candidate Assessment Complete",
    message: "AI analysis complete for Michael Johnson's profile",
    time: "3 hours ago",
    read: true,
    type: "system"
  },
  {
    id: "4",
    title: "Reminder",
    message: "Don't forget to review the pending candidates",
    time: "1 day ago",
    read: true,
    type: "system"
  }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results or filter the current page
    console.log("Searching for:", searchQuery);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(n => n.id !== id)
    );
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="w-8 h-8 bg-cvision-purple rounded-md flex items-center justify-center">
            <span className="text-white font-bold">CV</span>
          </div>
          <span className="hidden md:inline-block">CVision</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search candidates..."
              className="w-full rounded-md border bg-gray-50 pl-8 dark:bg-gray-800 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center text-xs bg-cvision-purple"
                    variant="default"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      className="text-xs text-cvision-purple hover:text-cvision-purple-dark"
                    >
                      Mark all as read
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`relative p-4 rounded-lg ${
                          notification.read 
                            ? "bg-gray-50 dark:bg-gray-800" 
                            : "bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-cvision-purple"></span>
                            )}
                          </div>
                          <Button
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 -mt-1 -mr-1 text-gray-400 hover:text-gray-500"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-cvision-purple hover:text-cvision-purple-dark"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full" 
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-cvision-purple text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documentation">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Documentation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
