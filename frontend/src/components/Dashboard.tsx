import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import Dialog components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileInput from "@/components/FileInput"
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

type Candidate = {
  id: string;
  name: string;
  position: string;
  summary: string;
  tags: string[];
  github?: string;
};

type FormData = {
  userXProfile: string;
  githubProfile: string;
  pdfFile: FileList | null;
};

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false); // Modal open state
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // Fetching candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/candidates");
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSubmit = (data: FormData) => {
    toast.success('Form submitted successfully!');
    console.log(data);
    setModalOpen(false); // Close the modal after submission
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === 'application/pdf') {
      toast.success('Valid PDF file selected');
    } else {
      toast.error('Please upload a valid PDF file.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
        <p className="text-muted-foreground">List of imported and analyzed candidates.</p>
      </div>

      <Separator className="mb-6" />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{candidate.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{candidate.position}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">{candidate.summary}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {candidate.github && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(candidate.github, "_blank");
                    }}
                  >
                    View GitHub
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Button to open the modal */}
      <Button onClick={() => setModalOpen(true)} className="mt-6">Add Candidate</Button>

      {/* Modal with form */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Candidate Form</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new candidate.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* User X Profile Link */}
            <div className="space-y-2">
              <Label htmlFor="userXProfile">User X Profile Link</Label>
              <Input
                id="userXProfile"
                type="url"
                placeholder="Enter User X Profile URL"
                {...register('userXProfile', { required: false })}
              />
              {errors.userXProfile && <span className="text-red-500">This field is required</span>}
            </div>

            {/* GitHub Profile Link */}
            <div className="space-y-2">
              <Label htmlFor="githubProfile">GitHub Profile Link</Label>
              <Input
                id="githubProfile"
                type="url"
                placeholder="Enter GitHub Profile URL"
                {...register('githubProfile', { required: false })}
              />
              {errors.githubProfile && <span className="text-red-500">This field is required</span>}
            </div>

            {/* PDF File Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdfFile">Upload PDF File</Label>
              <FileInput
                id="pdfFile"
                accept=".pdf"
                {...register('pdfFile', { required: false })}
                onChange={handleFileChange}
              />
              {errors.pdfFile && <span className="text-red-500">PDF file is required</span>}
            </div>

            <Button type="submit" className="mt-4">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
