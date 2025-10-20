// services/apiService.ts
/**
 * Mock API Service
 * This file simulates a backend server and database. In a real-world application,
 * these functions would make network requests (e.g., using fetch) to a REST or GraphQL API.
 */
import { Job, Company, JobSeeker, Admin, Review, JobType, LocationType, BlogPost, ReactionType, Reaction, Comment } from '../types';

// --- SIMULATED DATABASE ---
let seekers: JobSeeker[] = [
    { id: 101, name: 'Alex Doe', email: 'alex.doe@example.com', password: 'password123', phone: '123-456-7890', photoUrl: 'https://i.pravatar.cc/150?u=alex', skills: ['React', 'TypeScript', 'Node.js'], resumeUrl: '#', expectedSalary: 90000, appliedJobs: [1] },
    { id: 102, name: 'Brenda Smith', email: 'brenda.smith@example.com', password: 'password123', phone: '234-567-8901', photoUrl: 'https://i.pravatar.cc/150?u=brenda', skills: ['Vue', 'JavaScript', 'CSS'], resumeUrl: '#', expectedSalary: 80000, appliedJobs: [] },
];
let companies: Company[] = [
    { id: 201, name: 'Innovate Inc.', email: 'contact@innovate.com', password: 'password123', logo: 'https://i.pravatar.cc/150?u=innovate', description: 'A leading tech company.', website: 'https://innovate.com', contactInfo: '123- Innovate St.', officeAddress: '123 Tech Park, Silicon Valley, CA', reviews: [
        { id: 1, reviewerName: 'Brenda Smith', rating: 4.5, comment: 'Great place to work!', date: '2023-10-26' },
        { id: 2, reviewerName: 'External Person', rating: 5, comment: 'Excellent culture and benefits.', date: '2023-10-25' }
    ], jobs: [1, 2] },
    { id: 202, name: 'Creative Solutions', email: 'hr@creative.com', password: 'password123', logo: 'https://i.pravatar.cc/150?u=creative', description: 'We make creative software.', website: 'https://creative.com', contactInfo: '456- Creative Ave.', officeAddress: '456 Design Plaza, San Francisco, CA', reviews: [
        { id: 3, reviewerName: 'Alex Doe', rating: 3, comment: 'It was okay, long hours.', date: '2023-10-24' }
    ], jobs: [3] },
];
let jobs: Job[] = [
    { id: 1, companyId: 201, title: 'Frontend Developer', description: 'Job description here...', location: 'New York, NY', experienceLevel: 'Mid-Level', salaryMin: 80000, salaryMax: 100000, jobType: JobType.FullTime, locationType: LocationType.Hybrid, applicants: [101], shortlisted: [], rejected: [] },
    { id: 2, companyId: 201, title: 'Backend Developer', description: 'Job description here...', location: 'Remote', experienceLevel: 'Senior', salaryMin: 120000, salaryMax: 150000, jobType: JobType.FullTime, locationType: LocationType.Remote, applicants: [], shortlisted: [], rejected: [] },
    { id: 3, companyId: 202, title: 'UI/UX Designer', description: 'Job description here...', location: 'San Francisco, CA', experienceLevel: 'Junior', salaryMin: 60000, salaryMax: 75000, jobType: JobType.Contract, locationType: LocationType.Onsite, applicants: [], shortlisted: [], rejected: [] },
];
let blogPosts: BlogPost[] = [
    {
        id: 1,
        authorId: 201,
        authorName: 'Innovate Inc.',
        authorRole: 'company',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=innovate',
        content: 'We are excited to announce we are hiring for several new roles! Check out our open positions for Frontend and Backend developers.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        reactions: [],
        comments: [],
    },
    {
        id: 2,
        authorId: 101,
        authorName: 'Alex Doe',
        authorRole: 'seeker',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=alex',
        content: 'Just had a great interview experience! My tip for fellow developers: always be prepared to talk about a project you are passionate about. It really shows your skills and enthusiasm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        reactions: [],
        comments: [
            { id: 1, authorId: 102, authorName: 'Brenda Smith', authorPhotoUrl: 'https://i.pravatar.cc/150?u=brenda', content: 'That\'s a great tip, Alex! Thanks for sharing.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
        ],
    }
];
const admins: Admin[] = [
    { id: 301, email: 'sidunnobiovi@gmail.com', password: '9Ga19eUz' },
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
          officeAddress: '',
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
  
  addBlogPost: async(postData: Omit<BlogPost, 'id' | 'timestamp' | 'reactions' | 'comments'>): Promise<BlogPost> => {
    await delay(200);
    const newPost: BlogPost = {
        ...postData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        reactions: [],
        comments: [],
    };
    blogPosts = [newPost, ...blogPosts];
    return newPost;
  },
  
  updateBlogPost: async(postId: number, content: string): Promise<BlogPost> => {
    await delay(200);
    let updatedPost: BlogPost | undefined;
    blogPosts = blogPosts.map(p => {
        if (p.id === postId) {
            updatedPost = { ...p, content };
            return updatedPost;
        }
        return p;
    });
    if (!updatedPost) throw new Error("Post not found");
    return updatedPost;
  },
  
  addOrUpdateReaction: async(postId: number, userId: number, type: ReactionType): Promise<BlogPost> => {
    await delay(100);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");

    const originalPost = blogPosts[postIndex];
    const existingReactionIndex = originalPost.reactions.findIndex(r => r.userId === userId);
    
    let newReactions: Reaction[];

    if (existingReactionIndex > -1) {
      // User has reacted before
      const existingReaction = originalPost.reactions[existingReactionIndex];
      if (existingReaction.type === type) {
        // Same reaction clicked, so remove it (toggle off)
        newReactions = originalPost.reactions.filter((_, index) => index !== existingReactionIndex);
      } else {
        // Different reaction clicked, so update it
        newReactions = originalPost.reactions.map((reaction, index) => 
            index === existingReactionIndex ? { ...reaction, type: type } : reaction
        );
      }
    } else {
      // New reaction
      newReactions = [...originalPost.reactions, { userId, type }];
    }
    
    const updatedPost = { ...originalPost, reactions: newReactions };
    blogPosts[postIndex] = updatedPost;
    return updatedPost;
  },

  addComment: async(postId: number, commentData: Omit<Comment, 'id' | 'timestamp'>): Promise<BlogPost> => {
    await delay(200);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");

    const newComment: Comment = {
      ...commentData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    
    const originalPost = blogPosts[postIndex];
    const updatedPost = { ...originalPost, comments: [...originalPost.comments, newComment] };
    blogPosts[postIndex] = updatedPost;

    return updatedPost;
  },

  updateComment: async(postId: number, commentId: number, content: string): Promise<BlogPost> => {
    await delay(200);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");

    const originalPost = blogPosts[postIndex];
    
    const updatedComments = originalPost.comments.map(c => {
        if (c.id === commentId) {
            return { ...c, content };
        }
        return c;
    });

    const updatedPost = { ...originalPost, comments: updatedComments };
    blogPosts[postIndex] = updatedPost;
    
    return updatedPost;
  },

  deleteComment: async(postId: number, commentId: number): Promise<BlogPost> => {
    await delay(200);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");
    
    const originalPost = blogPosts[postIndex];
    const updatedComments = originalPost.comments.filter(c => c.id !== commentId);
    
    const updatedPost = { ...originalPost, comments: updatedComments };
    blogPosts[postIndex] = updatedPost;

    return updatedPost;
  },

  // --- ADMIN ACTIONS ---
  deleteEntity: async(type: 'job' | 'company' | 'seeker' | 'blogPost', id: number): Promise<boolean> => {
    await delay(300);
    if (type === 'job') jobs = jobs.filter(j => j.id !== id);
    if (type === 'seeker') seekers = seekers.filter(s => s.id !== id);
    if (type === 'blogPost') blogPosts = blogPosts.filter(p => p.id !== id);
    if (type === 'company') {
        companies = companies.filter(c => c.id !== id);
        // Also remove jobs associated with that company
        jobs = jobs.filter(j => j.companyId !== id);
    }
    return true;
  }
};