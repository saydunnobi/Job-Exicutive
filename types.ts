
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
  logo: string;
  description: string;
  website: string;
  contactInfo: string;
  reviews: Review[];
  postedJobs: number[]; // array of job ids
}

export interface JobSeeker {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: { title: string; company: string; years: string }[];
  education: { degree: string; school: string; year: string }[];
  expectedSalary: number;
  resumeUrl?: string;
  photoUrl: string;
  viewedBy: number[]; // array of company ids
  appliedJobs: number[]; // array of job ids
}

export enum JobType {
  FullTime = "Full-time",
  PartTime = "Part-time",
  Contract = "Contract",
  Internship = "Internship",
}

export enum LocationType {
  Onsite = "On-site",
  Remote = "Remote",
  Hybrid = "Hybrid",
}

export interface Job {
  id: number;
  title: string;
  companyId: number;
  description: string;
  location: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  jobType: JobType;
  locationType: LocationType;
  applicants: number[]; // array of job seeker ids
  shortlisted: number[];
  rejected: number[];
}

export enum UserRole {
  JobSeeker = 'job_seeker',
  Company = 'company',
  Admin = 'admin'
}
