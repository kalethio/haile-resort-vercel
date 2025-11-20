export interface Application {
  id: number;
  jobId: number;
  fullName: string;
  email: string;
  phone: string | null;
  currentLocation: string | null;
  educationLevel: string | null;
  yearsExperience: number | null;
  skills: string[];
  languages: string[];
  certifications: string[];
  availabilityDate: string | null;
  willingToRelocate: boolean;
  expectedSalary: string | null;
  coverLetter: string | null;
  resumeUrl: string | null;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  submittedAt: string;
  job?: {
    title: string;
    department: string | null;
    branch: {
      branchName: string;
      id: number;
    };
  };
}

export interface Job {
  id: number;
  title: string;
  department: string | null;
  description: string;
  requirements: string[];
  location: string | null;
  type: string | null;
  published: boolean;
  deadline: string | null;
  experienceLevel: string | null;
  responsibilities: string[];
  salaryRange: string | null;
  branches: string[]; // This will be derived from branch relationship
  branchId: number;
}

export interface Branch {
  id: number;
  branchName: string;
  slug: string;
  // ... other branch fields you need
}
