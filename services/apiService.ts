// services/apiService.ts
/**
 * Mock API Service
 * This file simulates a backend server and database. In a real-world application,
 * these functions would make network requests (e.g., using fetch) to a REST or GraphQL API.
 */
import { Job, Company, JobSeeker, Admin, Review, JobType, LocationType } from '../types';

// --- SIMULATED DATABASE ---
let seekers: JobSeeker[] = [
    { id: 1, name: 'Alex Doe', email: 'alex.doe@example.com', password: 'password123', phone: '123-456-7890', photoUrl: 'https://i.pravatar.cc/150?u=alex', skills: ['React', 'TypeScript', 'Node.js'], resumeUrl: '#', expectedSalary: 90000, appliedJobs: [1] },
    { id: 2, name: 'Brenda Smith', email: 'brenda.smith@example.com', password: 'password123', phone: '234-567-8901', photoUrl: 'https://i.pravatar.cc/150?u=brenda', skills: ['Vue', 'JavaScript', 'CSS'], resumeUrl: '#', expectedSalary: 80000, appliedJobs: [] },
];
let companies: Company[] = [
    { id: 1, name: 'Innovate Inc.', email: 'contact@innovate.com', password: 'password123', logo: 'https://i.pravatar.cc/150?u=innovate', description: 'A leading tech company.', website: 'https://innovate.com', contactInfo: '123- Innovate St.', reviews: [], jobs: [1, 2] },
    { id: 2, name: 'Creative Solutions', email: 'hr@creative.com', password: 'password123', logo: 'https://i.pravatar.cc/150?u=creative', description: 'We make creative software.', website: 'https://creative.com', contactInfo: '456- Creative Ave.', reviews: [], jobs: [3] },
];
let jobs: Job[] = [
    { id: 1, companyId: 1, title: 'Frontend Developer', description: 'Job description here...', location: 'New York, NY', experienceLevel: 'Mid-Level', salaryMin: 80000, salaryMax: 100000, jobType: JobType.FullTime, locationType: LocationType.Hybrid, applicants: [1], shortlisted: [], rejected: [] },
    { id: 2, companyId: 1, title: 'Backend Developer', description: 'Job description here...', location: 'Remote', experienceLevel: 'Senior', salaryMin: 120000, salaryMax: 150000, jobType: JobType.FullTime, locationType: LocationType.Remote, applicants: [], shortlisted: [], rejected: [] },
    { id: 3, companyId: 2, title: 'UI/UX Designer', description: 'Job description here...', location: 'San Francisco, CA', experienceLevel: 'Junior', salaryMin: 60000, salaryMax: 75000, jobType: JobType.Contract, locationType: LocationType.Onsite, applicants: [], shortlisted: [], rejected: [] },
];
const admins: Admin[] = [
    { id: 1, email: 'admin@jobflow.com', password: 'password123' },
];
// --- END SIMULATED DATABASE ---

type UserRole = 'seeker' | 'company' | 'admin';
type User = JobSeeker | Company | Admin;

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // --- AUTHENTICATION ---
  authenticateUser: async (email: string, password: string, role: UserRole): Promise<{ user: User; role: UserRole } | { error: string }> => {
    await delay(300);

    let user: User | undefined;
    
    if (role === 'seeker') {
      user = seekers.find(u => u.email === email);
      if (user && user.password !== password) return { error: 'Invalid password.' };
      if (!user) { // Auto-create user
        const newSeeker: JobSeeker = {
          id: Date.now(),
          name: email.split('@')[0],
          email,
          password,
          phone: '',
          photoUrl: `https://i.pravatar.cc/150?u=${email}`,
          skills: [],
          resumeUrl: '',
          expectedSalary: 0,
          appliedJobs: [],
        };
        seekers.push(newSeeker);
        user = newSeeker;
      }
    } else if (role === 'company') {
      user = companies.find(u => u.email === email);
      if (user && user.password !== password) return { error: 'Invalid password.' };
      if (!user) { // Auto-create company
        const newCompany: Company = {
          id: Date.now(),
          name: email.split('@')[0],
          email,
          password,
          logo: `https://i.pravatar.cc/150?u=${email}`,
          description: '',
          website: '',
          contactInfo: '',
          reviews: [],
          jobs: [],
        };
        companies.push(newCompany);
        user = newCompany;
      }
    } else if (role === 'admin') {
      user = admins.find(u => u.email === email);
      if (!user || user.password !== password) return { error: 'Invalid credentials.' };
    }

    if (user) {
      return { user, role };
    }
    return { error: 'Invalid credentials.' };
  },

  // --- DATA FETCHING ---
  getSeekers: async (): Promise<JobSeeker[]> => { await delay(100); return seekers; },
  getCompanies: async (): Promise<Company[]> => { await delay(100); return companies; },
  getJobs: async (): Promise<Job[]> => { await delay(100); return jobs; },

  // --- DATA MUTATION ---
  updateSeeker: async (updatedSeeker: JobSeeker): Promise<JobSeeker> => {
    await delay(200);
    seekers = seekers.map(s => s.id === updatedSeeker.id ? updatedSeeker : s);
    return updatedSeeker;
  },
  
  updateCompany: async (updatedCompany: Company): Promise<Company> => {
    await delay(200);
    companies = companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
    return updatedCompany;
  },

  addReview: async(companyId: number, review: Omit<Review, 'id' | 'date'>): Promise<Company> => {
    await delay(200);
    const newReview = { ...review, id: Date.now(), date: new Date().toLocaleDateString() };
    let updatedCompany: Company | undefined;
    companies = companies.map(c => {
      if (c.id === companyId) {
        updatedCompany = { ...c, reviews: [...c.reviews, newReview] };
        return updatedCompany;
      }
      return c;
    });
    if (!updatedCompany) throw new Error("Company not found");
    return updatedCompany;
  },

  postJob: async(jobData: Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>): Promise<Job> => {
    await delay(200);
    const newJob: Job = {
        ...jobData,
        id: Date.now(),
        applicants: [],
        shortlisted: [],
        rejected: []
    };
    jobs = [newJob, ...jobs];
    return newJob;
  },

  // --- ADMIN ACTIONS ---
  deleteEntity: async(type: 'job' | 'company' | 'seeker', id: number): Promise<boolean> => {
    await delay(300);
    if (type === 'job') jobs = jobs.filter(j => j.id !== id);
    if (type === 'seeker') seekers = seekers.filter(s => s.id !== id);
    if (type === 'company') {
        companies = companies.filter(c => c.id !== id);
        // Also remove jobs associated with that company
        jobs = jobs.filter(j => j.companyId !== id);
    }
    return true;
  }
};
