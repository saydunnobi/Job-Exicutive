// services/apiService.ts
/**
 * Mock API Service
 * This file simulates a backend server and database. In a real-world application,
 * these functions would make network requests (e.g., using fetch) to a REST or GraphQL API.
 */
import { Job, Company, JobSeeker, Admin, Review, JobType, LocationType, BlogPost } from '../types';

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
let blogPosts: BlogPost[] = [
    {
        id: 1,
        authorId: 1,
        authorName: 'Innovate Inc.',
        authorRole: 'company',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=innovate',
        content: 'We are excited to announce we are hiring for several new roles! Check out our open positions for Frontend and Backend developers.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: 2,
        authorId: 1,
        authorName: 'Alex Doe',
        authorRole: 'seeker',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=alex',
        content: 'Just had a great interview experience! My tip for fellow developers: always be prepared to talk about a project you are passionate about. It really shows your skills and enthusiasm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    }
];
const admins: Admin[] = [
    { id: 1, email: 'sidunnobiovi@gmail.com', password: '9Ga19eUz' },
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

    // Check for admin credentials first, regardless of the role selected in the UI
    const adminUser = admins.find(u => u.email === email);
    if (adminUser && adminUser.password === password) {
        return { user: adminUser, role: 'admin' };
    }

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
  getBlogPosts: async (): Promise<BlogPost[]> => { await delay(100); return blogPosts; },


  // --- DATA MUTATION ---
  saveSeeker: async (seekerData: JobSeeker): Promise<JobSeeker> => {
    await delay(200);
    // ID of 0 indicates a new seeker
    if (seekerData.id === 0) {
      const newSeeker = { ...seekerData, id: Date.now() };
      seekers.push(newSeeker);
      return newSeeker;
    }
    // Existing ID means update
    seekers = seekers.map(s => s.id === seekerData.id ? seekerData : s);
    return seekerData;
  },
  
  saveCompany: async (companyData: Company): Promise<Company> => {
    await delay(200);
    // ID of 0 indicates a new company
    if (companyData.id === 0) {
      const newCompany = { ...companyData, id: Date.now() };
      companies.push(newCompany);
      return newCompany;
    }
    // Existing ID means update
    companies = companies.map(c => c.id === companyData.id ? companyData : c);
    return companyData;
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

  saveJob: async(jobData: Job | Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>): Promise<Job> => {
    await delay(200);
    if ('id' in jobData && jobData.id) { // Update existing job
        const index = jobs.findIndex(j => j.id === jobData.id);
        if (index === -1) throw new Error("Job not found");
        const fullJob = jobs[index];
        const updatedJob = { ...fullJob, ...jobData };
        jobs[index] = updatedJob;
        return updatedJob;
    } else { // Create new job
        const newJob: Job = {
            ...(jobData as Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>),
            id: Date.now(),
            applicants: [],
            shortlisted: [],
            rejected: []
        };
        jobs = [newJob, ...jobs];
        return newJob;
    }
  },
  
  addBlogPost: async(postData: Omit<BlogPost, 'id' | 'timestamp'>): Promise<BlogPost> => {
    await delay(200);
    const newPost: BlogPost = {
        ...postData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    blogPosts = [newPost, ...blogPosts];
    return newPost;
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