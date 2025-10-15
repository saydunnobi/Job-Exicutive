export enum JobType {
  FullTime = 'Full-Time',
  PartTime = 'Part-Time',
  Contract = 'Contract',
  Internship = 'Internship',
}

export enum LocationType {
  Onsite = 'On-site',
  Remote = 'Remote',
  Hybrid = 'Hybrid',
}

export interface Job {
  id: number;
  companyId: number;
  title: string;
  description: string;
  location: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  jobType: JobType;
  locationType: LocationType;
  applicants: number[]; // array of seeker ids
  shortlisted: number[];
  rejected: number[];
}

export interface Review {
    id: number;
    reviewerName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  password?: string; // Added for auth
  logo: string;
  description: string;
  website: string;
  contactInfo: string;
  reviews: Review[];
  jobs: number[]; // array of job ids
}

export interface JobSeeker {
  id: number;
  name: string;
  email: string;
  password?: string; // Added for auth
  phone: string;
  photoUrl: string;
  skills: string[];
  resumeUrl: string; // url to pdf
  expectedSalary: number;
  appliedJobs: number[]; // array of job ids
}

export interface Admin {
  id: number;
  email: string;
  password?: string; // Added for auth
}
