
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Plus, Search, Filter, Users} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import CandidateTable from "@/components/dashboard/CandidateTable";
import { Candidate, CandidateStatus } from "@/lib/types";
import { getCandidates } from "@/lib/mock-data";
import { debounce } from "@/lib/utils";

const statuses: { label: string; value: CandidateStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Assessment", value: "assessment" },
  { label: "Offer", value: "offer" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, statusFilter, candidates]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as CandidateStatus | "all");
  };

  const filterCandidates = debounce(() => {
    let filtered = [...candidates];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        candidate =>
          candidate.name.toLowerCase().includes(term) ||
          candidate.email.toLowerCase().includes(term) ||
          candidate.position.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  }, 300);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Button asChild className="bg-cvision-purple hover:bg-cvision-purple-dark">
          <Link to="/add-candidate">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Link>
        </Button>
      </div>

      <div className="bg-white p-4 rounded-md border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-6 w-24 bg-gray-200 rounded mx-auto"></div>
            <p className="text-sm text-gray-400 mt-2">Loading candidates...</p>
          </div>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <CandidateTable candidates={filteredCandidates} />
      ) : (
        <div className="bg-white border rounded-md p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <h3 className="text-lg font-medium mb-1">No candidates found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "No candidates match your search criteria. Try adjusting your filters."
              : "You haven't added any candidates yet."}
          </p>
          <Button asChild className="bg-cvision-purple hover:bg-cvision-purple-dark">
            <Link to="/add-candidate">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Candidate
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Candidates;
