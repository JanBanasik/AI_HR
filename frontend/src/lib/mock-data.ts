
import {AiRating, Candidate, CandidateStatus, DashboardStats} from './types';

// Mock candidates data
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    position: 'Frontend Developer',
    status: 'interview',
    createdAt: '2023-12-10T14:30:00Z',
    github: 'alexjohnson',
    twitter: 'alexjdev',
    leetcode: 'alexj',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    experience: 3,
    aiSummary: 'Alex is a motivated frontend developer with strong React skills. Their GitHub shows clean code practices and good documentation habits.',
    aiRating: 'good'
  },
  {
    id: '2',
    name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    position: 'Backend Developer',
    status: 'assessment',
    createdAt: '2023-12-15T10:15:00Z',
    github: 'samwilson',
    leetcode: 'wilson_s',
    skills: ['Node.js', 'Express', 'MongoDB'],
    experience: 4,
    aiSummary: 'Sam demonstrates excellent problem-solving skills and has contributed to several open-source projects. LeetCode profile shows strong algorithmic thinking.',
    aiRating: 'excellent'
  },
  {
    id: '3',
    name: 'Jamie Smith',
    email: 'jamie.smith@example.com',
    position: 'Full Stack Developer',
    status: 'applied',
    createdAt: '2024-01-05T09:45:00Z',
    twitter: 'jamiedev',
    skills: ['JavaScript', 'React', 'Python', 'Django'],
    experience: 2,
    aiSummary: 'Jamie has a diverse skill set but limited professional experience. Social media presence indicates good communication skills.',
    aiRating: 'average'
  },
  {
    id: '4',
    name: 'Taylor Reed',
    email: 'taylor.reed@example.com',
    position: 'UX/UI Designer',
    status: 'screening',
    createdAt: '2024-01-10T13:20:00Z',
    twitter: 'taylorrdesigns',
    github: 'taylorreed',
    skills: ['Figma', 'Adobe XD', 'UI/UX Research'],
    experience: 5,
    aiSummary: 'Taylor has a strong portfolio showing user-centered design approach. Their GitHub contains design system components and accessibility-focused projects.',
    aiRating: 'good'
  },
  {
    id: '5',
    name: 'Morgan Chen',
    email: 'morgan.chen@example.com',
    position: 'DevOps Engineer',
    status: 'hired',
    createdAt: '2023-11-20T11:30:00Z',
    github: 'morganchen',
    leetcode: 'chen_morgan',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    experience: 7,
    aiSummary: 'Morgan has extensive infrastructure automation experience with excellent problem-solving skills demonstrated on their LeetCode profile.',
    aiRating: 'excellent'
  },
  {
    id: '6',
    name: 'Jordan Patel',
    email: 'jordan.patel@example.com',
    position: 'Data Scientist',
    status: 'offer',
    createdAt: '2023-12-05T15:45:00Z',
    github: 'jordanpatel',
    twitter: 'jpatel_data',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    experience: 4,
    aiSummary: 'Jordan has implemented several sophisticated machine learning models and contributed to data science libraries. Active in the community.',
    aiRating: 'good'
  },
  {
    id: '7',
    name: 'Riley Cooper',
    email: 'riley.cooper@example.com',
    position: 'QA Engineer',
    status: 'rejected',
    createdAt: '2023-11-15T10:00:00Z',
    github: 'rileycooper',
    skills: ['Test Automation', 'Selenium', 'Cypress', 'JIRA'],
    experience: 2,
    aiSummary: 'Riley has some automation experience but lacks depth in test strategy. GitHub repositories show limited test coverage approaches.',
    aiRating: 'below_average'
  }
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalCandidates: mockCandidates.length,
  newCandidates: mockCandidates.filter(c => c.status === 'applied').length,
  inProgress: mockCandidates.filter(c => ['screening', 'interview', 'assessment', 'offer'].includes(c.status)).length,
  hired: mockCandidates.filter(c => c.status === 'hired').length
};

// Helper functions to simulate API calls
export const getCandidates = (): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCandidates);
    }, 500);
  });
};

export const getCandidateById = (id: string): Promise<Candidate | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCandidates.find(candidate => candidate.id === id));
    }, 300);
  });
};

export const getDashboardStats = (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardStats);
    }, 400);
  });
};

export const addCandidate = (newCandidate: Omit<Candidate, 'id' | 'createdAt' | 'aiSummary' | 'aiRating'>): Promise<Candidate> => {
  return new Promise((resolve) => {
    // Simulate API processing and AI analysis
    setTimeout(() => {
      const candidate: Candidate = {
        ...newCandidate,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        aiSummary: "Based on the provided information, this candidate shows potential. Further assessment is recommended.",
        aiRating: 'pending',
        status: 'applied'
      };
      
      // In a real application, we would save this to a database
      mockCandidates.push(candidate);
      
      resolve(candidate);
    }, 1000);
  });
};

// Helper function to simulate AI analysis
export const analyzeCandidate = (candidateId: string): Promise<{ summary: string, rating: AiRating }> => {
  return new Promise((resolve) => {
    // Simulate AI processing
    setTimeout(() => {
      // Find candidate
      const candidate = mockCandidates.find(c => c.id === candidateId);
      
      if (!candidate) {
        resolve({
          summary: "Unable to analyze candidate. Insufficient data.",
          rating: 'average'
        });
        return;
      }
      
      // This is where real AI would analyze the candidate data
      const ratings: AiRating[] = ['excellent', 'good', 'average', 'below_average', 'poor'];
      const randomRating = ratings[Math.floor(Math.random() * 3)]; // Bias toward better ratings
      
      // Generate a fake summary based on available candidate data
      let summary = `Based on analysis of ${candidate.github ? 'GitHub, ' : ''}${candidate.twitter ? 'X (Twitter), ' : ''}${candidate.leetcode ? 'LeetCode, ' : ''}and resume data, `;
      
      if (randomRating === 'excellent' || randomRating === 'good') {
        summary += `${candidate.name} appears to be a strong candidate for the ${candidate.position} role. `;
        summary += candidate.github ? 'Code repositories show good architecture and clean code practices. ' : '';
        summary += candidate.leetcode ? 'Problem-solving skills are well demonstrated. ' : '';
        summary += 'Recommended for next steps in the hiring process.';
      } else if (randomRating === 'average') {
        summary += `${candidate.name} meets basic qualifications for the ${candidate.position} position. `;
        summary += 'Some areas could benefit from more experience. Consider additional assessment.';
      } else {
        summary += `${candidate.name} may not be the best fit for the ${candidate.position} role at this time. `;
        summary += 'Consider other candidates or a different position.';
      }
      
      // In a real application, this would update the database
      if (candidate) {
        candidate.aiSummary = summary;
        candidate.aiRating = randomRating;
      }
      
      resolve({
        summary,
        rating: randomRating
      });
    }, 2000);
  });
};
