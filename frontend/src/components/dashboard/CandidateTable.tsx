
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Github, Twitter, FileCode } from "lucide-react";
import { Candidate } from "@/lib/types";
import { formatDate, getInitials, getStatusBadgeColor } from "@/lib/utils";

interface CandidateTableProps {
  candidates: Candidate[];
  limit?: number;
}

const CandidateTable = ({ candidates, limit }: CandidateTableProps) => {
  const displayCandidates = limit ? candidates.slice(0, limit) : candidates;

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Candidate</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Profiles</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-cvision-purple-light text-cvision-purple">
                      {getInitials(candidate.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link 
                      to={`/candidates/${candidate.id}`}
                      className="font-medium text-cvision-text hover:text-cvision-purple"
                    >
                      {candidate.name}
                    </Link>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{candidate.position}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(candidate.status)}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {candidate.github && (
                    <a 
                      href={`https://github.com/${candidate.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cvision-purple"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {candidate.twitter && (
                    <a 
                      href={`https://twitter.com/${candidate.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cvision-purple"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {candidate.leetcode && (
                    <a 
                      href={`https://leetcode.com/${candidate.leetcode}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cvision-purple"
                    >
                      <FileCode size={18} />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(candidate.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to={`/candidates/${candidate.id}`} className="w-full">
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                    <DropdownMenuItem>Send Email</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
