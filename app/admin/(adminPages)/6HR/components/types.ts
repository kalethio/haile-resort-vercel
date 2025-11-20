// components/career/types.ts
export type Job = {
  id: string;
  title: string;
  department: string;
  branches: string[]; // For display
  branchIds: number[]; // For form selection
  type: string;
  location: string;
  experienceLevel?: string;
  salaryRange?: string;
  deadline?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  applicants?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  status?: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
};

export type Branch = {
  id: number;
  branchName: string;
  slug: string;
};

// For admin job form
export type JobFormData = {
  title: string;
  department: string;
  description: string;
  location: string;
  type: string;
  experienceLevel: string;
  salaryRange: string;
  deadline: string;
  responsibilities: string[];
  requirements: string[];
  published: boolean;
  branchIds: number[];
};
