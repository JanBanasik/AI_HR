
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCandidateFormData } from "@/lib/types";
import { addCandidate, analyzeCandidate } from "@/lib/mock-data";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  github: z.string().optional(),
  twitter: z.string().optional(),
  leetcode: z.string().optional(),
});

const AddCandidateForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      github: "",
      twitter: "",
      leetcode: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if it's a PDF
      if (file.type === "application/pdf") {
        setCvFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, we would upload the CV file to a server
      // and get a URL back
      let cvUrl;
      if (cvFile) {
        // Mock CV upload - in a real app, we'd upload to storage
        cvUrl = `uploads/${cvFile.name}`;
      }
      
      // Create candidate with form values
      const candidateData: Omit<AddCandidateFormData, 'cv'> & { cvUrl?: string } = {
        ...values,
        cvUrl
      };
      
      // Add candidate to the system
      const newCandidate = await addCandidate(candidateData);
      
      // Simulate AI analysis - in a real app, this would happen on the backend
      await analyzeCandidate(newCandidate.id);
      
      toast({
        title: "Candidate added successfully",
        description: "The candidate has been added to the system.",
      });
      
      // Navigate to the candidate's page
      navigate(`/candidates/${newCandidate.id}`);
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Error adding candidate",
        description: "There was an error adding the candidate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-gray-500">
              Enter the candidate's basic details
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Applied For</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Online Profiles</h3>
            <p className="text-sm text-gray-500">
              Add links to the candidate's online profiles (optional)
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (Twitter) Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leetcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeetCode Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Resume/CV</h3>
            <p className="text-sm text-gray-500">
              Upload the candidate's resume or CV (PDF only)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormLabel>Upload CV</FormLabel>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  id="cv" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <div className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => document.getElementById("cv")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select PDF
                  </Button>
                </div>
                {cvFile && (
                  <div className="text-sm">
                    <span className="font-medium">{cvFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-cvision-purple hover:bg-cvision-purple-dark"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Adding Candidate..." : "Add Candidate"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCandidateForm;
