
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, RefreshCw, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusData = [
  { name: "Applied", value: 35, color: "#9b87f5" },
  { name: "Screening", value: 20, color: "#7E69AB" },
  { name: "Interview", value: 15, color: "#6E59A5" },
  { name: "Assessment", value: 10, color: "#5E49A0" },
  { name: "Offered", value: 8, color: "#4E399B" },
  { name: "Hired", value: 5, color: "#3E2996" },
  { name: "Rejected", value: 7, color: "#E5DEFF" },
];

const timeToHireData = [
  { name: "Jan", days: 28 },
  { name: "Feb", days: 25 },
  { name: "Mar", days: 22 },
  { name: "Apr", days: 20 },
  { name: "May", days: 19 },
  { name: "Jun", days: 15 },
  { name: "Jul", days: 18 },
  { name: "Aug", days: 17 },
  { name: "Sep", days: 16 },
  { name: "Oct", days: 14 },
  { name: "Nov", days: 15 },
  { name: "Dec", days: 17 },
];

const sourcesData = [
  { name: "LinkedIn", value: 45, color: "#9b87f5" },
  { name: "Referral", value: 25, color: "#7E69AB" },
  { name: "Company Website", value: 15, color: "#6E59A5" },
  { name: "Job Boards", value: 10, color: "#5E49A0" },
  { name: "Other", value: 5, color: "#3E2996" },
];

const positionsData = [
  { name: "Frontend Dev", value: 20 },
  { name: "Backend Dev", value: 18 },
  { name: "UX Designer", value: 12 },
  { name: "DevOps", value: 10 },
  { name: "Product Manager", value: 8 },
  { name: "QA Engineer", value: 7 },
  { name: "Data Scientist", value: 5 },
  { name: "Other", value: 20 },
];

const monthlyApplicationsData = [
  { name: "Jan", count: 25 },
  { name: "Feb", count: 30 },
  { name: "Mar", count: 45 },
  { name: "Apr", count: 40 },
  { name: "May", count: 55 },
  { name: "Jun", count: 60 },
  { name: "Jul", count: 50 },
  { name: "Aug", count: 45 },
  { name: "Sep", count: 65 },
  { name: "Oct", count: 70 },
  { name: "Nov", count: 60 },
  { name: "Dec", count: 50 },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Report refreshed",
        description: "The report data has been updated with the latest information.",
      });
    }, 1500);
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would generate a PDF or Excel report
    toast({
      title: "Report downloading",
      description: "Your report is being generated and will download shortly.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recruitment Reports</h1>
          <p className="text-muted-foreground">Analyze your recruitment performance and candidate pipeline.</p>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="time-range">Time Range:</Label>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger id="time-range" className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="halfyear">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="time-to-hire">Time to Hire</TabsTrigger>
          <TabsTrigger value="sources">Candidate Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Pipeline Status</CardTitle>
                <CardDescription>
                  Candidates by stage in the recruitment process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} candidates`, 'Count']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Applications</CardTitle>
                <CardDescription>
                  Number of candidate applications per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyApplicationsData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#9b87f5" name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Applications by Position</CardTitle>
                <CardDescription>
                  Distribution of candidates by job position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={positionsData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 70,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7E69AB" name="Candidates" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Candidate Sources</CardTitle>
                <CardDescription>
                  Where candidates are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {sourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>
                Detailed view of candidates across different stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={statusData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Candidates" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-cvision-purple mb-1">100</div>
                  <div className="text-sm text-gray-500">Total Candidates</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">5%</div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-600 mb-1">65%</div>
                  <div className="text-sm text-gray-500">Pipeline Velocity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time-to-hire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time to Hire Analysis</CardTitle>
              <CardDescription>
                Average days to hire by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={timeToHireData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} days`, 'Average Time']} />
                  <Legend />
                  <Bar dataKey="days" name="Average Days to Hire" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-2">Time to Hire Insights</h3>
                <ul className="space-y-2 text-sm">
                  <li>• The average time to hire has decreased by 39% over the last year</li>
                  <li>• Technical positions take 30% longer to fill than non-technical positions</li>
                  <li>• The screening phase accounts for 40% of the total time to hire</li>
                  <li>• Referral candidates are hired 35% faster than other sources</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Sources Analysis</CardTitle>
              <CardDescription>
                Effectiveness of different recruitment channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Top Performing Sources</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">LinkedIn</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-cvision-purple h-2.5 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Referrals</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-cvision-purple h-2.5 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Company Website</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-cvision-purple h-2.5 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Source Quality</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span>Source</span>
                      <span>Hire Rate</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Referrals</span>
                      <span className="font-medium text-green-600">22%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>LinkedIn</span>
                      <span className="font-medium text-amber-600">15%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Company Website</span>
                      <span className="font-medium text-amber-600">12%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Job Boards</span>
                      <span className="font-medium text-red-600">8%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Other</span>
                      <span className="font-medium text-red-600">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
