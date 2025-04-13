
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import CandidateTable from "@/components/dashboard/CandidateTable";
import { Candidate, DashboardStats } from "@/lib/types";
import { getCandidates, getDashboardStats } from "@/lib/mock-data";

const Dashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [candidatesData, statsData] = await Promise.all([
          getCandidates(),
          getDashboardStats()
        ]);
        
        setCandidates(candidatesData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild className="bg-cvision-purple hover:bg-cvision-purple-dark">
          <Link to="/add-candidate">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Candidates"
          value={stats?.totalCandidates || 0}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          className={isLoading ? "opacity-60 animate-pulse" : ""}
        />
        <StatCard
          title="New Candidates"
          value={stats?.newCandidates || 0}
          icon={<UserPlus className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          className={isLoading ? "opacity-60 animate-pulse" : ""}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
          className={isLoading ? "opacity-60 animate-pulse" : ""}
        />
        <StatCard
          title="Hired"
          value={stats?.hired || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 2, isPositive: true }}
          className={isLoading ? "opacity-60 animate-pulse" : ""}
        />
      </div>

      {/* Recent Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Candidates</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/candidates" className="text-cvision-purple hover:text-cvision-purple-dark">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-center">
                <div className="h-6 w-24 bg-gray-200 rounded mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">Loading candidates...</p>
              </div>
            </div>
          ) : (
            <CandidateTable candidates={candidates} limit={5} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
