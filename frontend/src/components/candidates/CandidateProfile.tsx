
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  Github, 
  Twitter, 
  FileCode, 
  FileText, 
  Calendar, 
  Mail, 
  Award,
  User,
  Briefcase
} from "lucide-react";
import { Candidate } from "@/lib/types";
import { getCandidateById, analyzeCandidate } from "@/lib/mock-data";
import { formatDate, getInitials, getStatusBadgeColor, getRatingColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      try {
        const data = await getCandidateById(id);
        if (data) {
          setCandidate(data);
        } else {
          toast({
            title: "Candidate not found",
            description: "The candidate you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/candidates");
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        toast({
          title: "Error loading candidate",
          description: "There was an error loading the candidate details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, navigate, toast]);

  const handleAnalyze = async () => {
    if (!candidate) return;
    
    setAnalyzing(true);
    try {
      const result = await analyzeCandidate(candidate.id);
      setCandidate(prev => {
        if (!prev) return null;
        return {
          ...prev,
          aiSummary: result.summary,
          aiRating: result.rating
        };
      });
      
      toast({
        title: "Analysis Complete",
        description: "Candidate profile has been analyzed.",
      });
    } catch (error) {
      console.error("Error analyzing candidate:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing this candidate.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-10 w-56" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <Badge className={getStatusBadgeColor(candidate.status)}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/edit-candidate/${candidate.id}`)}
          >
            Edit Profile
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="bg-cvision-purple hover:bg-cvision-purple-dark"
          >
            {analyzing ? "Analyzing..." : "Analyze Candidate"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Candidate Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-cvision-purple-light text-cvision-purple">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-xl">{candidate.name}</h3>
              <p className="text-gray-500">{candidate.position}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{candidate.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Applied on {formatDate(candidate.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{candidate.experience || 0} years experience</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-3">Online Profiles</p>
              <div className="space-y-3">
                {candidate.github && (
                  <a 
                    href={`https://github.com/${candidate.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-cvision-purple"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    github.com/{candidate.github}
                  </a>
                )}
                {candidate.twitter && (
                  <a 
                    href={`https://twitter.com/${candidate.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-cvision-purple"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    twitter.com/{candidate.twitter}
                  </a>
                )}
                {candidate.leetcode && (
                  <a 
                    href={`https://leetcode.com/${candidate.leetcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-cvision-purple"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    leetcode.com/{candidate.leetcode}
                  </a>
                )}
                {candidate.cvUrl && (
                  <a 
                    href={candidate.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-cvision-purple"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume/CV
                  </a>
                )}
                {!candidate.github && !candidate.twitter && !candidate.leetcode && !candidate.cvUrl && (
                  <p className="text-sm text-gray-500">No profiles added</p>
                )}
              </div>
            </div>
            
            {candidate.skills && candidate.skills.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Column - AI Analysis & Tabs */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>AI Assessment</CardTitle>
                  <CardDescription>
                    Automated analysis based on candidate data
                  </CardDescription>
                </div>
                {candidate.aiRating && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-cvision-purple" />
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">Rating:</span>
                      <div className={`h-3 w-3 rounded-full ${getRatingColor(candidate.aiRating)} mr-1`}></div>
                      <span className="text-sm capitalize">
                        {candidate.aiRating.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {candidate.aiSummary ? (
                <p className="text-sm">{candidate.aiSummary}</p>
              ) : (
                <div className="bg-gray-50 rounded-md p-4 text-center">
                  <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">
                    This candidate hasn't been analyzed yet. Click "Analyze Candidate" to get AI insights.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="bg-white p-6 rounded-md border mt-2">
              <div className="space-y-4">
                <h3 className="font-medium">Candidate Overview</h3>
                <p className="text-sm text-gray-600">
                  {candidate.name} applied for the {candidate.position} position on {formatDate(candidate.createdAt)}. 
                  The candidate is currently in the <span className="font-medium">{candidate.status}</span> stage of the hiring process.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Candidate Journey</p>
                  <div className="relative">
                    <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-gray-200"></div>
                    <div className="space-y-3 ml-6">
                      <div>
                        <p className="text-xs text-gray-500">{formatDate(candidate.createdAt)}</p>
                        <p className="text-sm">Candidate applied</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{formatDate(new Date(new Date(candidate.createdAt).getTime() + 86400000))}</p>
                        <p className="text-sm">Application reviewed</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{formatDate(new Date(new Date(candidate.createdAt).getTime() + 172800000))}</p>
                        <p className="text-sm">Current status: <span className="font-medium capitalize">{candidate.status}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="interviews" className="bg-white p-6 rounded-md border mt-2">
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Interviews Scheduled</h3>
                <p className="text-sm text-gray-500 mb-4">There are no interviews scheduled for this candidate.</p>
                <Button className="bg-cvision-purple hover:bg-cvision-purple-dark">
                  Schedule Interview
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="bg-white p-6 rounded-md border mt-2">
              <div className="text-center py-6">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Notes Yet</h3>
                <p className="text-sm text-gray-500 mb-4">There are no notes for this candidate yet.</p>
                <Button className="bg-cvision-purple hover:bg-cvision-purple-dark">
                  Add Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
