
import React, { useState, useMemo } from 'react';
// FIX: Import JobType and LocationType enums to use in mock data.
import { Job, Company, JobSeeker, Review, UserRole, JobType, LocationType } from './types';
import JobCard from './components/JobCard';
import Modal from './components/Modal';
import { BriefcaseIcon, BuildingOfficeIcon, StarIcon } from './components/icons';
import ResumeBooster from './components/ResumeBooster';

// MOCK DATA
const mockCompanies: Company[] = [
    { id: 1, name: 'Innovate Inc.', logo: 'https://picsum.photos/seed/company1/200', description: 'A leading tech company.', website: 'innovate.com', contactInfo: 'contact@innovate.com', reviews: [{id: 1, reviewerName: 'John Doe', rating: 5, comment: 'Great place to work!', date: '2023-10-26'}], postedJobs: [1, 3] },
    { id: 2, name: 'Creative Solutions', logo: 'https://picsum.photos/seed/company2/200', description: 'We make creative software.', website: 'creative.com', contactInfo: 'hr@creative.com', reviews: [{id: 2, reviewerName: 'Jane Smith', rating: 1, comment: 'Terrible management.', date: '2023-10-25'}, {id: 3, reviewerName: 'Peter Jones', rating: 2, comment: 'Low salary.', date: '2023-10-24'}], postedJobs: [2] },
];

const mockJobSeekers: JobSeeker[] = [
    { id: 101, name: 'Alice Johnson', email: 'alice@email.com', phone: '123-456-7890', skills: ['React', 'TypeScript', 'Node.js'], experience: [{title: 'Frontend Developer', company: 'Tech Corp', years: '2'}], education: [{degree: 'B.S. Computer Science', school: 'State University', year: '2021'}], expectedSalary: 80000, photoUrl: 'https://picsum.photos/seed/seeker1/200', viewedBy: [1], appliedJobs: [2] },
];

// FIX: Use JobType and LocationType enums instead of string literals to match type definitions.
const mockJobs: Job[] = [
    { id: 1, title: 'Frontend Developer', companyId: 1, description: 'Develop amazing user interfaces.', location: 'New York, NY', experienceLevel: 'Mid-Senior', salaryMin: 90000, salaryMax: 120000, jobType: JobType.FullTime, locationType: LocationType.Hybrid, applicants: [], shortlisted: [], rejected: [] },
    { id: 2, title: 'Backend Engineer', companyId: 2, description: 'Work on our scalable backend.', location: 'San Francisco, CA', experienceLevel: 'Senior', salaryMin: 120000, salaryMax: 150000, jobType: JobType.FullTime, locationType: LocationType.Remote, applicants: [101], shortlisted: [], rejected: [] },
    { id: 3, title: 'UI/UX Designer', companyId: 1, description: 'Design beautiful and intuitive layouts.', location: 'Austin, TX', experienceLevel: 'Junior', salaryMin: 60000, salaryMax: 80000, jobType: JobType.Contract, locationType: LocationType.Onsite, applicants: [], shortlisted: [], rejected: [] },
];
// END MOCK DATA

// A simple component to render star ratings
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

// Main App Component
const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<JobSeeker | Company | null>(mockJobSeekers[0]);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.JobSeeker);

    const [jobs, setJobs] = useState<Job[]>(mockJobs);
    const [companies, setCompanies] = useState<Company[]>(mockCompanies);
    const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>(mockJobSeekers);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleApply = (jobId: number) => {
        if (userRole === UserRole.JobSeeker && currentUser) {
            const seeker = currentUser as JobSeeker;
            if (seeker.appliedJobs.includes(jobId)) return;

            // Update seeker's applied jobs
            const updatedSeeker = { ...seeker, appliedJobs: [...seeker.appliedJobs, jobId] };
            setJobSeekers(jobSeekers.map(js => js.id === seeker.id ? updatedSeeker : js));
            setCurrentUser(updatedSeeker);

            // Update job's applicants
            setJobs(jobs.map(job => job.id === jobId ? { ...job, applicants: [...job.applicants, seeker.id] } : job));

            alert(`Successfully applied for job ID ${jobId}`);
        }
    };
    
    const viewJobDetails = (jobId: number) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            setSelectedJob(job);
            setIsModalOpen(true);
        }
    };

    const switchUserRole = (role: UserRole) => {
        setUserRole(role);
        if(role === UserRole.JobSeeker) {
            setCurrentUser(jobSeekers[0]);
        } else {
            setCurrentUser(companies[0]);
        }
    }
    
    const averageRating = (company: Company) => {
      if (company.reviews.length === 0) return 0;
      const total = company.reviews.reduce((acc, review) => acc + review.rating, 0);
      return total / company.reviews.length;
    };

    const renderHeader = () => (
      <header className="bg-white shadow-md sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-neutral ml-2">JobFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">Viewing as:</span>
              <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
                  <button onClick={() => switchUserRole(UserRole.JobSeeker)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${userRole === UserRole.JobSeeker ? 'bg-primary text-white shadow' : 'text-gray-600'}`}>Job Seeker</button>
                  <button onClick={() => switchUserRole(UserRole.Company)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${userRole === UserRole.Company ? 'bg-primary text-white shadow' : 'text-gray-600'}`}>Company</button>
              </div>
          </div>
        </nav>
      </header>
    );

    const renderJobSeekerDashboard = () => {
        const seeker = currentUser as JobSeeker;
        if(!seeker) return null;
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-neutral mb-4">Applied Jobs</h2>
                        <div className="space-y-4">
                            {seeker.appliedJobs.length > 0 ? jobs.filter(j => seeker.appliedJobs.includes(j.id)).map(job => (
                                <div key={job.id} className="p-4 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{job.title}</p>
                                        <p className="text-sm text-gray-500">{companies.find(c => c.id === job.companyId)?.name}</p>
                                    </div>
                                    <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Applied</span>
                                </div>
                            )) : <p className="text-gray-500">You haven't applied to any jobs yet.</p>}
                        </div>
                    </div>
                    <ResumeBooster />
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <img src={seeker.photoUrl} alt={seeker.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary" />
                        <h2 className="text-xl font-bold text-center text-neutral">{seeker.name}</h2>
                        <p className="text-center text-gray-500 mb-4">{seeker.email}</p>
                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {seeker.skills.map(skill => <span key={skill} className="bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-bold text-neutral mb-4">Who Viewed Your Profile</h3>
                        <div className="space-y-3">
                            {seeker.viewedBy.map(companyId => {
                                const company = companies.find(c => c.id === companyId);
                                return company ? (
                                    <div key={company.id} className="flex items-center">
                                        <img src={company.logo} alt={company.name} className="h-10 w-10 rounded-full mr-3" />
                                        <span className="font-semibold">{company.name}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCompanyDashboard = () => {
        const company = currentUser as Company;
        if (!company) return null;
        
        const avgRating = averageRating(company);

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-neutral mb-4">Posted Jobs & Applicants</h2>
                        <div className="space-y-6">
                            {company.postedJobs.map(jobId => {
                                const job = jobs.find(j => j.id === jobId);
                                if (!job) return null;
                                return (
                                    <div key={job.id} className="p-4 border rounded-lg">
                                        <h3 className="font-bold text-lg">{job.title}</h3>
                                        <p className="text-sm text-gray-500">{job.applicants.length} applicant(s)</p>
                                        <div className="mt-4 space-y-2">
                                            {job.applicants.map(seekerId => {
                                                const seeker = jobSeekers.find(s => s.id === seekerId);
                                                return seeker ? (
                                                    <div key={seeker.id} className="flex items-center bg-gray-50 p-2 rounded-md">
                                                        <img src={seeker.photoUrl} className="h-10 w-10 rounded-full mr-4" />
                                                        <div>
                                                            <p className="font-semibold">{seeker.name}</p>
                                                            <p className="text-xs text-blue-600 hover:underline cursor-pointer">View Profile</p>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                 <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-secondary" />
                        <h2 className="text-xl font-bold text-center text-neutral">{company.name}</h2>
                         {avgRating < 2.5 && avgRating > 0 && <span className="block mx-auto mt-2 text-center text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit">Bad Profile</span>}
                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-bold mb-2 text-neutral">Company Reviews</h3>
                            <div className="flex items-center justify-center mb-2">
                               <StarRating rating={Math.round(avgRating)} />
                               <span className="ml-2 text-gray-600 text-sm">({company.reviews.length} reviews)</span>
                            </div>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                               {company.reviews.map(review => (
                                   <div key={review.id} className="text-sm p-2 bg-gray-50 rounded">
                                       <div className="flex justify-between">
                                           <span className="font-semibold">{review.reviewerName}</span>
                                           <StarRating rating={review.rating} />
                                       </div>
                                       <p className="text-gray-600 italic">"{review.comment}"</p>
                                   </div>
                               ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
    
    const selectedJobCompany = useMemo(() => {
        if (!selectedJob) return null;
        return companies.find(c => c.id === selectedJob.companyId);
    }, [selectedJob, companies]);

    return (
        <div className="min-h-screen bg-base-200 font-sans">
            {renderHeader()}
            <main className="container mx-auto px-6 py-8">
                
                {userRole === UserRole.JobSeeker && (
                    <>
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-neutral tracking-tight">Find Your Dream Job</h2>
                            <p className="mt-4 text-lg text-gray-600">Browse thousands of job openings from top companies.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {jobs.map(job => {
                                const company = companies.find(c => c.id === job.companyId);
                                const isApplied = (currentUser as JobSeeker)?.appliedJobs.includes(job.id);
                                if (!company) return null;
                                return (
                                    <JobCard 
                                        key={job.id} 
                                        job={job} 
                                        company={company} 
                                        onApply={handleApply}
                                        onViewDetails={viewJobDetails}
                                        isApplied={isApplied}
                                    />
                                );
                            })}
                        </div>
                         <h2 className="text-3xl font-bold text-neutral mb-6 border-b-4 border-primary pb-2">My Dashboard</h2>
                         {renderJobSeekerDashboard()}
                    </>
                )}
                
                {userRole === UserRole.Company && (
                   <>
                        <div className="text-left mb-12">
                            <h2 className="text-4xl font-extrabold text-neutral tracking-tight">Company Dashboard</h2>
                            <p className="mt-4 text-lg text-gray-600">Manage your job postings and applicants.</p>
                        </div>
                         {renderCompanyDashboard()}
                   </>
                )}


            </main>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedJob?.title || ''}>
                {selectedJob && selectedJobCompany && (
                    <div className="space-y-4">
                        <div className="flex items-center">
                           <img src={selectedJobCompany.logo} alt={selectedJobCompany.name} className="h-12 w-12 rounded-full mr-4"/>
                           <div>
                               <h3 className="text-lg font-bold text-primary">{selectedJobCompany.name}</h3>
                               <a href={`http://${selectedJobCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:underline">{selectedJobCompany.website}</a>
                           </div>
                        </div>
                        <p className="text-gray-700">{selectedJob.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-4">
                           <p><strong>Location:</strong> {selectedJob.location}</p>
                           <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                           <p><strong>Salary:</strong> ${selectedJob.salaryMin.toLocaleString()} - ${selectedJob.salaryMax.toLocaleString()}</p>
                           <p><strong>Experience:</strong> {selectedJob.experienceLevel}</p>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                              onClick={() => handleApply(selectedJob.id)}
                              disabled={(currentUser as JobSeeker)?.appliedJobs.includes(selectedJob.id)}
                              className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                            >
                              {(currentUser as JobSeeker)?.appliedJobs.includes(selectedJob.id) ? 'Applied' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default App;
