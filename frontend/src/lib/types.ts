
export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: CandidateStatus;
  createdAt: string;
  github?: string;
  twitter?: string;
  leetcode?: string;
  cvUrl?: string;
  aiSummary?: string;
  aiRating?: AiRating;
  skills?: string[];
  experience?: number;
}

export type CandidateStatus = 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';

export type AiRating = 'excellent' | 'good' | 'average' | 'below_average' | 'poor' | 'pending';

export interface AddCandidateFormData {
  name: string;
  email: string;
  position: string;
  github?: string;
  twitter?: string;
  leetcode?: string;
  cv?: File;
}

export interface DashboardStats {
  totalCandidates: number;
  newCandidates: number;
  inProgress: number;
  hired: number;
}
