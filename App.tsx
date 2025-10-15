
import React, { useState } from 'react';
import { Company, Job, JobSeeker, JobType, LocationType } from './types';
import JobCard from './components/JobCard';
import ResumeBooster from './components/ResumeBooster';
import LoginPage from './components/LoginPage';
import Modal from './components/Modal';
import JobSeekerProfileEdit from './components/JobSeekerProfileEdit';
import CompanyProfileEdit from './components/CompanyProfileEdit';
import PostJobForm from './components/PostJobForm';

// Mock Data
const MOCK_COMPANIES: Company[] = [
  { id: 1, name: 'Innovate Inc.', description: 'A leading tech company.', logo: 'https://via.placeholder.com/150/0000FF/808080?Text=Innovate', website: 'innovate.com', contactInfo: 'contact@innovate.com' },
  { id: 2, name: 'Creative Solutions', description: 'We build amazing things.', logo: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Creative', website: 'creative.com', contactInfo: 'hr@creative.com' },
];

const MOCK_JOBS: Job[] = [
  { id: 1, companyId: 1, title: 'Frontend Developer', description: '...', location: 'Remote', experienceLevel: 'Mid-Senior', salaryMin: 80000, salaryMax: 120000, jobType: JobType.FullTime, locationType: LocationType.Remote, applicants: [], shortlisted: [], rejected: [] },
  { id: 2, companyId: 2, title: 'Backend Engineer', description: '...', location: 'New York, NY', experienceLevel: 'Senior', salaryMin: 120000, salaryMax: 160000, jobType: JobType.FullTime, locationType: LocationType.Onsite, applicants: [], shortlisted: [], rejected: [] },
  { id: 3, companyId: 1, title: 'UX/UI Designer', description: '...', location: 'San Francisco, CA', experienceLevel: 'Junior', salaryMin: 60000, salaryMax: 85000, jobType: JobType.Contract, locationType: LocationType.Hybrid, applicants: [], shortlisted: [], rejected: [] },
];

const MOCK_JOB_SEEKER: JobSeeker = {
  id: 1,
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  phone: '123-456-7890',
  photoUrl: 'https://via.placeholder.com/100',
  resumeUrl: '',
  skills: ['React', 'TypeScript', 'Node.js'],
  expectedSalary: 90000,
  appliedJobs: [],
};

const App: React.FC = () => {
  const [user, setUser] = useState<'seeker' | 'company' | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [seeker, setSeeker] = useState<JobSeeker>(MOCK_JOB_SEEKER);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  
  // Modal states
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPostJobModalOpen, setPostJobModalOpen] = useState(false);
  
  const handleLogin = (userType: 'seeker' | 'company') => {
    setUser(userType);
  };

  const handleApply = (jobId: number) => {
    setAppliedJobs(prev => [...prev, jobId]);
    alert(`Applied for job ${jobId}!`);
  };
  
  const handleSaveSeekerProfile = (updatedSeeker: JobSeeker) => {
    setSeeker(updatedSeeker);
    setProfileModalOpen(false);
  };
  
  const handleSaveCompanyProfile = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setProfileModalOpen(false);
  };
  
  const handlePostJob = (newJob: Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>) => {
    const jobWithId = { ...newJob, id: Date.now(), applicants: [], shortlisted: [], rejected: [] };
    setJobs(prev => [jobWithId, ...prev]);
    setPostJobModalOpen(false);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const findCompany = (id: number) => companies.find(c => c.id === id)!;

  const SeekerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-neutral">Open Positions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                company={findCompany(job.companyId)}
                onApply={handleApply}
                onViewDetails={(id) => alert(`Viewing details for job ${id}`)}
                isApplied={appliedJobs.includes(job.id)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <ResumeBooster />
        </div>
      </div>
      <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title="Edit Your Profile">
          <JobSeekerProfileEdit seeker={seeker} onSave={handleSaveSeekerProfile} onCancel={() => setProfileModalOpen(false)} />
      </Modal>
    </>
  );

  const CompanyDashboard = () => (
     <>
      <h2 className="text-3xl font-bold mb-6 text-neutral">Your Job Postings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.filter(j => j.companyId === companies[0].id).map(job => (
          <div key={job.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{job.title}</h3>
            <p>{job.location}</p>
            <p>Applicants: {job.applicants.length}</p>
          </div>
        ))}
      </div>
       <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title="Edit Company Profile">
          <CompanyProfileEdit company={companies[0]} onSave={handleSaveCompanyProfile} onCancel={() => setProfileModalOpen(false)} />
      </Modal>
       <Modal isOpen={isPostJobModalOpen} onClose={() => setPostJobModalOpen(false)} title="Post a New Job">
          <PostJobForm companyId={companies[0].id} onPostJob={handlePostJob} onCancel={() => setPostJobModalOpen(false)} />
      </Modal>
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">JobBoard.ai</h1>
          <div>
             {user === 'seeker' && <button onClick={() => setProfileModalOpen(true)} className="font-semibold text-neutral hover:text-primary mr-4">My Profile</button>}
             {user === 'company' && <button onClick={() => setProfileModalOpen(true)} className="font-semibold text-neutral hover:text-primary mr-4">Company Profile</button>}
             {user === 'company' && <button onClick={() => setPostJobModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-focus ml-2">Post a Job</button>}
             <button onClick={() => setUser(null)} className="font-semibold text-neutral hover:text-primary ml-4">Logout</button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {user === 'seeker' ? <SeekerDashboard /> : <CompanyDashboard />}
      </main>
    </div>
  );
};

export default App;
