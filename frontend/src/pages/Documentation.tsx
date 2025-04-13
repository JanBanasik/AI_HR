
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, Calendar, ChevronRight, PieChart, Settings, Search } from "lucide-react";

const Documentation = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">Learn how to use CVision and make the most of its features.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Contents</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-1">
                  <Link to="#getting-started" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FileText className="h-4 w-4 mr-2" />
                    Getting Started
                  </Link>
                  <Link to="#candidates" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Users className="h-4 w-4 mr-2" />
                    Managing Candidates
                  </Link>
                  <Link to="#interviews" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Calendar className="h-4 w-4 mr-2" />
                    Scheduling Interviews
                  </Link>
                  <Link to="#reports" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <PieChart className="h-4 w-4 mr-2" />
                    Reports
                  </Link>
                  <Link to="#settings" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <Link to="#search" className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Link>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card id="getting-started">
                <CardHeader>
                  <CardTitle>Getting Started with CVision</CardTitle>
                  <CardDescription>
                    Learn the basics of using the CVision recruitment platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-medium">Welcome to CVision</h3>
                  <p>
                    CVision is a powerful recruitment management platform designed to streamline your hiring process. 
                    With AI-powered candidate analysis, intuitive interface, and comprehensive tracking tools, 
                    CVision helps you find the best candidates quickly and efficiently.
                  </p>
                  
                  <h4 className="text-md font-medium mt-4">Key Features</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-powered candidate analysis and scoring</li>
                    <li>Centralized candidate management</li>
                    <li>Interview scheduling and tracking</li>
                    <li>Customizable recruitment workflows</li>
                    <li>Comprehensive reporting tools</li>
                    <li>Integration with popular recruitment platforms</li>
                  </ul>
                  
                  <Separator className="my-4" />
                  
                  <h4 className="text-md font-medium">Dashboard Overview</h4>
                  <p>
                    The dashboard provides a quick overview of your recruitment activities, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Total number of candidates in your pipeline</li>
                    <li>New candidates added recently</li>
                    <li>Candidates currently in progress</li>
                    <li>Recently hired candidates</li>
                    <li>Upcoming interviews</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card id="candidates">
                <CardHeader>
                  <CardTitle>Managing Candidates</CardTitle>
                  <CardDescription>
                    Learn how to add, view, and manage candidates in CVision.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-medium">Adding New Candidates</h3>
                  <p>
                    To add a new candidate to CVision, click the "Add Candidate" button on the dashboard 
                    or candidates page. Fill in the candidate's details, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information</li>
                    <li>Position they're applying for</li>
                    <li>GitHub, Twitter, and LeetCode profiles (optional)</li>
                    <li>Upload their CV in PDF format</li>
                  </ul>
                  
                  <p className="mt-4">
                    Once added, CVision's AI will automatically analyze the candidate's profile 
                    and provide you with a summary and evaluation to help with your decision-making.
                  </p>
                  
                  <h4 className="text-md font-medium mt-4">Viewing Candidate Profiles</h4>
                  <p>
                    Click on any candidate in the list to view their detailed profile. From there, you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Review their personal information and application details</li>
                    <li>See the AI-generated summary and evaluation</li>
                    <li>Access their social profiles and CV</li>
                    <li>Schedule interviews</li>
                    <li>Update their status in the recruitment process</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>
                    Explore the powerful features of CVision.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">AI-Powered Candidate Analysis</h3>
                      <p className="text-muted-foreground mt-1">
                        CVision uses advanced AI algorithms to analyze candidate profiles, including their 
                        CV, GitHub repositories, and other professional information to provide you with 
                        comprehensive insights about their skills and potential fit for the role.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Centralized Candidate Management</h3>
                      <p className="text-muted-foreground mt-1">
                        Keep all candidate information in one place. Track their progress through your 
                        recruitment pipeline, from application to hire, with customizable status workflows.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Interview Scheduling</h3>
                      <p className="text-muted-foreground mt-1">
                        Schedule and manage interviews directly within CVision. Send automated invitations, 
                        track confirmations, and maintain a clear overview of your interview calendar.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Reporting and Analytics</h3>
                      <p className="text-muted-foreground mt-1">
                        Gain insights into your recruitment process with comprehensive reports and analytics. 
                        Track metrics such as time-to-hire, source effectiveness, and candidate quality.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>
                    Learn how to integrate with the CVision API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                    <p className="text-sm">
                      The API documentation is currently being updated. Please check back soon for 
                      comprehensive API documentation.
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">API Endpoints</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Here are some of the key API endpoints available:
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Endpoint</th>
                            <th className="text-left py-2 px-4">Method</th>
                            <th className="text-left py-2 px-4">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">/api/candidates</td>
                            <td className="py-2 px-4">GET</td>
                            <td className="py-2 px-4">List all candidates</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">/api/candidates/{"{id}"}</td>
                            <td className="py-2 px-4">GET</td>
                            <td className="py-2 px-4">Get candidate details</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">/api/candidates</td>
                            <td className="py-2 px-4">POST</td>
                            <td className="py-2 px-4">Create a new candidate</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">/api/interviews</td>
                            <td className="py-2 px-4">GET</td>
                            <td className="py-2 px-4">List all interviews</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-mono text-sm">/api/reports</td>
                            <td className="py-2 px-4">GET</td>
                            <td className="py-2 px-4">Generate reports</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions about using CVision.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium">How does the AI candidate analysis work?</h3>
                      <p className="text-muted-foreground mt-1">
                        CVision uses advanced natural language processing to analyze candidate CVs, 
                        GitHub repositories, and other profiles. The AI looks for relevant skills, 
                        experience patterns, and potential matches with the job requirements to 
                        provide a comprehensive evaluation.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium">Can I customize the recruitment workflow?</h3>
                      <p className="text-muted-foreground mt-1">
                        Yes, CVision allows you to customize the recruitment pipeline stages to match 
                        your organization's process. Navigate to Settings &gt; Workflow to configure your
                        custom stages.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium">How do I schedule an interview with a candidate?</h3>
                      <p className="text-muted-foreground mt-1">
                        You can schedule interviews from a candidate's profile page by clicking the 
                        "Schedule Interview" button. You'll be able to select available times, add 
                        participants, and send automated notifications to all involved.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium">Is it possible to integrate CVision with our ATS?</h3>
                      <p className="text-muted-foreground mt-1">
                        Yes, CVision offers API integration with popular Applicant Tracking Systems. 
                        Contact your administrator or our support team to set up the integration with 
                        your existing recruitment tools.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium">How secure is our candidate data?</h3>
                      <p className="text-muted-foreground mt-1">
                        CVision prioritizes data security. All data is encrypted in transit and at rest, 
                        and we implement strict access controls. For more information, please refer to 
                        our security documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
