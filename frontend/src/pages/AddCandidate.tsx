
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AddCandidateForm from "@/components/candidates/AddCandidateForm";

const AddCandidate = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Candidate</h1>
      </div>

      <div className="bg-white p-6 rounded-md border">
        <AddCandidateForm />
      </div>
    </div>
  );
};

export default AddCandidate;
