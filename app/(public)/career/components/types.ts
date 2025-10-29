export type Job = {
  id: string; // Keep string for compatibility
  title: string;
  department: string;
  branches: string[]; // Array of branch names (for display)
  branchIds: number[]; // Array of branch IDs (for database)
  type: string;
  location: string;
  experienceLevel?: string;
  salaryRange?: string;
  deadline?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  applicants?: number;
  published?: boolean; // New field for admin control
};

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  appliedBranch: string;
  fullName: string;
  email: string;
  phone?: string;
  currentLocation?: string;
  educationLevel?: string;
  yearsExperience?: number;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
  availabilityDate?: string;
  willingToRelocate?: boolean;
  expectedSalary?: string;
  coverLetter?: string;
  resumeName?: string;
  resumeBase64?: string | null;
  submittedAt: string;
};

export type Branch = {
  id: number;
  branchName: string;
  slug: string;
};
