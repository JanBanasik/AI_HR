
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Interview = {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: Date;
  startTime: string;
  endTime: string;
  interviewers: string[];
  type: "technical" | "behavioral" | "initial";
  status: "scheduled" | "completed" | "canceled" | "rescheduled";
  notes?: string;
};

// Mock data for interviews
const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateId: "1",
    candidateName: "John Doe",
    position: "Frontend Developer",
    date: new Date(2025, 3, 14, 10, 0), // April 14, 2025, 10:00 AM
    startTime: "10:00",
    endTime: "11:00",
    interviewers: ["Sarah Johnson", "Michael Chen"],
    type: "technical",
    status: "scheduled"
  },
  {
    id: "2",
    candidateId: "2",
    candidateName: "Emily Smith",
    position: "UX Designer",
    date: new Date(2025, 3, 14, 14, 0), // April 14, 2025, 2:00 PM
    startTime: "14:00",
    endTime: "15:00",
    interviewers: ["David Wilson"],
    type: "behavioral",
    status: "scheduled"
  },
  {
    id: "3",
    candidateId: "3",
    candidateName: "James Brown",
    position: "Backend Developer",
    date: new Date(2025, 3, 15, 11, 0), // April 15, 2025, 11:00 AM
    startTime: "11:00",
    endTime: "12:30",
    interviewers: ["Michael Chen", "Lisa Rodriguez"],
    type: "technical",
    status: "scheduled"
  },
  {
    id: "4",
    candidateId: "4",
    candidateName: "Amanda Johnson",
    position: "Product Manager",
    date: new Date(2025, 3, 16, 9, 0), // April 16, 2025, 9:00 AM
    startTime: "09:00",
    endTime: "10:00",
    interviewers: ["Sarah Johnson"],
    type: "initial",
    status: "scheduled"
  },
  {
    id: "5",
    candidateId: "5",
    candidateName: "Robert Davis",
    position: "DevOps Engineer",
    date: new Date(2025, 3, 17, 15, 30), // April 17, 2025, 3:30 PM
    startTime: "15:30",
    endTime: "16:30",
    interviewers: ["Michael Chen", "David Wilson"],
    type: "technical",
    status: "scheduled"
  }
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

// Sample team members for interview scheduling
const teamMembers = [
  "Sarah Johnson", "Michael Chen", "David Wilson", "Lisa Rodriguez", 
  "Robert Taylor", "Jennifer Lee", "Thomas Williams", "Emma Harris"
];

const Interviews = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showNewInterviewDialog, setShowNewInterviewDialog] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    position: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00",
    interviewers: [""],
    type: "technical",
  });
  
  // Calculate the start date of the week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      isSameDay(interview.date, date)
    ).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };
  
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = searchQuery === "" || 
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = !filterType || interview.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const handleAddInterview = () => {
    // In a real app, this would call an API to create the interview
    const newId = (interviews.length + 1).toString();
    const [year, month, day] = newInterview.date.split('-').map(Number);
    
    const interviewToAdd: Interview = {
      id: newId,
      candidateId: newId,
      candidateName: newInterview.candidateName,
      position: newInterview.position,
      date: new Date(year, month - 1, day),
      startTime: newInterview.startTime,
      endTime: newInterview.endTime,
      interviewers: newInterview.interviewers.filter(i => i !== ""),
      type: newInterview.type as "technical" | "behavioral" | "initial",
      status: "scheduled"
    };
    
    setInterviews([...interviews, interviewToAdd]);
    setShowNewInterviewDialog(false);
    
    toast({
      title: "Interview scheduled",
      description: `Interview with ${newInterview.candidateName} has been scheduled.`,
    });
    
    // Reset form
    setNewInterview({
      candidateName: "",
      position: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      endTime: "11:00",
      interviewers: [""],
      type: "technical",
    });
  };
  
  const addInterviewer = () => {
    setNewInterview({
      ...newInterview, 
      interviewers: [...newInterview.interviewers, ""]
    });
  };
  
  const removeInterviewer = (index: number) => {
    const updatedInterviewers = [...newInterview.interviewers];
    updatedInterviewers.splice(index, 1);
    setNewInterview({
      ...newInterview,
      interviewers: updatedInterviewers
    });
  };
  
  const updateInterviewer = (index: number, value: string) => {
    const updatedInterviewers = [...newInterview.interviewers];
    updatedInterviewers[index] = value;
    setNewInterview({
      ...newInterview,
      interviewers: updatedInterviewers
    });
  };
  
  const getInterviewTimeProps = (interview: Interview) => {
    const startHour = parseInt(interview.startTime.split(':')[0]);
    const startMinute = parseInt(interview.startTime.split(':')[1]);
    const endHour = parseInt(interview.endTime.split(':')[0]);
    const endMinute = parseInt(interview.endTime.split(':')[1]);
    
    // Calculate duration in minutes
    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    
    // Each 30 minutes = 1 unit of height (3rem)
    const height = `${Math.max(durationMinutes / 30 * 3, 3)}rem`;
    
    // Calculate top position based on start time (9:00 AM = 0rem)
    const startTimeOffset = (startHour - 9) * 60 + startMinute;
    const top = `${startTimeOffset / 30 * 3}rem`;
    
    return { height, top };
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Interviews</h1>
        
        <div className="flex items-center gap-2 self-end">
          <Dialog open={showNewInterviewDialog} onOpenChange={setShowNewInterviewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-cvision-purple hover:bg-cvision-purple-dark">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new interview with a candidate.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="candidate-name" className="text-right">
                    Candidate
                  </Label>
                  <Input
                    id="candidate-name"
                    placeholder="Candidate name"
                    className="col-span-3"
                    value={newInterview.candidateName}
                    onChange={(e) => setNewInterview({...newInterview, candidateName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    placeholder="Position applied"
                    className="col-span-3"
                    value={newInterview.position}
                    onChange={(e) => setNewInterview({...newInterview, position: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="col-span-3"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Select
                      value={newInterview.startTime}
                      onValueChange={(value) => setNewInterview({...newInterview, startTime: value})}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Start Time</SelectLabel>
                          {timeSlots.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select
                      value={newInterview.endTime}
                      onValueChange={(value) => setNewInterview({...newInterview, endTime: value})}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>End Time</SelectLabel>
                          {timeSlots.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newInterview.type}
                    onValueChange={(value) => setNewInterview({...newInterview, type: value})}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Interview Type</SelectLabel>
                        <SelectItem value="initial">Initial Screening</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Interviewers
                  </Label>
                  <div className="col-span-3 space-y-2">
                    {newInterview.interviewers.map((interviewer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={interviewer}
                          onValueChange={(value) => updateInterviewer(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select interviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Team Members</SelectLabel>
                              {teamMembers.map((member) => (
                                <SelectItem key={member} value={member}>
                                  {member}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {index > 0 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeInterviewer(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={addInterviewer}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Interviewer
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewInterviewDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-cvision-purple hover:bg-cvision-purple-dark"
                  onClick={handleAddInterview}
                >
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search candidates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="mb-4">
              <Label className="mb-2 block">Filter by type</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filterType === null ? "default" : "outline"}
                  className={`cursor-pointer ${filterType === null ? "bg-cvision-purple" : ""}`}
                  onClick={() => setFilterType(null)}
                >
                  All
                </Badge>
                <Badge 
                  variant={filterType === "initial" ? "default" : "outline"}
                  className={`cursor-pointer ${filterType === "initial" ? "bg-cvision-purple" : ""}`}
                  onClick={() => setFilterType("initial")}
                >
                  Initial
                </Badge>
                <Badge 
                  variant={filterType === "technical" ? "default" : "outline"}
                  className={`cursor-pointer ${filterType === "technical" ? "bg-cvision-purple" : ""}`}
                  onClick={() => setFilterType("technical")}
                >
                  Technical
                </Badge>
                <Badge 
                  variant={filterType === "behavioral" ? "default" : "outline"}
                  className={`cursor-pointer ${filterType === "behavioral" ? "bg-cvision-purple" : ""}`}
                  onClick={() => setFilterType("behavioral")}
                >
                  Behavioral
                </Badge>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              {filteredInterviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto opacity-20 mb-2" />
                  <p>No interviews match your filters</p>
                </div>
              ) : (
                filteredInterviews.map((interview) => (
                  <div 
                    key={interview.id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link 
                          to={`/candidates/${interview.candidateId}`}
                          className="font-medium hover:text-cvision-purple"
                        >
                          {interview.candidateName}
                        </Link>
                        <p className="text-sm text-gray-500">{interview.position}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${interview.type === "technical" && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"}
                          ${interview.type === "behavioral" && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"}
                          ${interview.type === "initial" && "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"}
                        `}
                      >
                        {interview.type === "initial" ? "Initial" : 
                         interview.type === "technical" ? "Technical" : 
                         "Behavioral"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {format(interview.date, "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {interview.startTime} - {interview.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-3.5 w-3.5 mr-1" />
                      {interview.interviewers.join(", ")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Interview Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToNextWeek}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {format(weekDates[0], "MMMM yyyy")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((date, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium">
                    {format(date, "EEE")}
                  </div>
                  <div 
                    className={`
                      text-sm rounded-full w-7 h-7 flex items-center justify-center mx-auto
                      ${isSameDay(date, new Date()) 
                        ? "bg-cvision-purple text-white" 
                        : "text-gray-500"}
                    `}
                  >
                    {format(date, "d")}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-7 gap-1 relative">
              {/* Time labels */}
              <div className="absolute -left-14 top-0 w-12 h-full flex flex-col text-right text-xs text-gray-500">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-6" style={{ marginTop: index === 0 ? 0 : "0.5rem" }}>
                    {`${index + 9}:00`}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              {weekDates.map((date, dayIndex) => (
                <div key={dayIndex} className="relative h-[500px] border-t min-w-[80px]">
                  {/* Time slots */}
                  {Array.from({ length: 18 }).map((_, slotIndex) => (
                    <div 
                      key={slotIndex} 
                      className={`absolute w-full h-[1.5rem] border-b border-gray-100 dark:border-gray-800 ${
                        slotIndex % 2 === 0 ? "border-gray-200 dark:border-gray-700" : ""
                      }`}
                      style={{ top: `${slotIndex * 1.5}rem` }}
                    />
                  ))}
                  
                  {/* Interviews for this day */}
                  {getInterviewsForDate(date).map((interview) => {
                    const { height, top } = getInterviewTimeProps(interview);
                    return (
                      <div
                        key={interview.id}
                        className={`
                          absolute w-[95%] left-[2.5%] rounded p-1.5 text-xs overflow-hidden shadow-sm border
                          ${interview.type === "technical" && "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"}
                          ${interview.type === "behavioral" && "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"}
                          ${interview.type === "initial" && "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300"}
                        `}
                        style={{ height, top }}
                      >
                        <div className="font-medium truncate">{interview.candidateName}</div>
                        <div className="truncate">{interview.startTime} - {interview.endTime}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interviews;
