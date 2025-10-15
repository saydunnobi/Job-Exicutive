
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
  applicants: number[]; // array of job seeker IDs
  shortlisted: number[];
  rejected: number[];
}

export interface Company {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  contactInfo: string;
}

export interface JobSeeker {
  id: number;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  resumeUrl: string;
  skills: string[];
  expectedSalary: number;
  appliedJobs: number[]; // array of job IDs
}

export interface Review {
  id: number;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string
}
