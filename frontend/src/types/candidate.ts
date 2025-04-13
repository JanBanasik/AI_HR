interface CandidateGithub {
    [language: string]: string;
}

interface CandidateX {
    person_id: string;
    fit_score: number;
    classification: "Positive" | "Negative" | "Neutral";
    stability_score: number;
    aggression_score: number;
    political_score: number;
    controversial_score: number;
    political_explanation: string;
    summary: string;
}

interface CandidateCV {
    name: string;
    contact: {
        email: string;
        phone: string;
    };
    tech_skills: string[];
    soft_skills: string[];
    experience: { title: string; description: string }[];
    projects: {
        title: string;
        description: string;
        technologies: string[];
        role: string;
        result?: string;
    }[];
    education: {
        university: string;
        degree: string;
        years: string;
    }[];
    certifications: string[];
    languages: {
        English: string;
        Polish: string;
    };
}

export interface Candidate {
    id: string;
    github: CandidateGithub;
    x: CandidateX;
    cv: CandidateCV;
}