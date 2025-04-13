
import { useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Laptop, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [autoProcessCandidates, setAutoProcessCandidates] = useState(true);
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Tabs defaultValue="preferences">
        <TabsList className="mb-4">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className={`flex-1 justify-start ${theme === "light" ? "bg-cvision-purple text-white" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-5 w-5" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className={`flex-1 justify-start ${theme === "dark" ? "bg-cvision-purple text-white" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-5 w-5" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className={`flex-1 justify-start ${theme === "system" ? "bg-cvision-purple text-white" : ""}`}
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="mr-2 h-5 w-5" />
                    System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>AI Processing</Label>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-process" className="text-base">Auto-process candidates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process new candidates with AI when they are added
                    </p>
                  </div>
                  <Switch
                    id="auto-process"
                    checked={autoProcessCandidates}
                    onCheckedChange={setAutoProcessCandidates}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={browserNotifications}
                    onCheckedChange={setBrowserNotifications}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="bg-cvision-purple hover:bg-cvision-purple-dark"
                  onClick={handleSavePreferences}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Manage your API keys and integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 py-2">
                <p className="text-muted-foreground">
                  Connect to your backend services to enable candidate processing, 
                  interview scheduling, and other features.
                </p>
                
                <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                  <p className="text-sm">
                    This feature requires backend configuration. Please contact your administrator
                    to set up API integration with your recruitment systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
