import React, { useState } from 'react';
import { Job, Company, JobSeeker, Review } from '../types';
import JobCard from './JobCard';
import Modal from './Modal';
import JobDetails from './JobDetails';
import ResumeBooster from './ResumeBooster';
import LeaveReviewForm from './LeaveReviewForm';
import JobSeekerProfileEdit from './JobSeekerProfileEdit';
import { PencilIcon } from './icons';

interface SeekerDashboardProps {
  seeker: JobSeeker;
  jobs: Job[];
  companies: Company[];
  onAddReview: (companyId: number, review: Omit<Review, 'id' | 'date'>) => void;
  onSaveProfile: (updatedSeeker: JobSeeker) => void;
}

const SeekerDashboard: React.FC<SeekerDashboardProps> = ({ seeker, jobs, companies, onAddReview, onSaveProfile }) => {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>(seeker.appliedJobs);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingCompany, setReviewingCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleViewDetails = (jobId: number) => {
    setSelectedJobId(jobId);
  };
  
  const handleCloseModal = () => {
    setSelectedJobId(null);
  };
  
  const handleApply = (jobId: number) => {
    if (!appliedJobs.includes(jobId)) {
        setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  const handleLeaveReview = (companyId: number) => {
    const companyToReview = companies.find(c => c.id === companyId);
    if (companyToReview) {
        setSelectedJobId(null); // Close details modal first
        setReviewingCompany(companyToReview);
        setIsReviewModalOpen(true);
    }
  };

  const handleSubmitReview = (review: Omit<Review, 'id' | 'date'>) => {
    if (reviewingCompany) {
        onAddReview(reviewingCompany.id, { ...review, reviewerName: seeker.name });
        setIsReviewModalOpen(false);
        setReviewingCompany(null);
    }
  };

  const handleSaveProfile = (updatedSeeker: JobSeeker) => {
    onSaveProfile(updatedSeeker);
    setIsEditModalOpen(false);
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const selectedJobCompany = selectedJob ? companies.find(c => c.id === selectedJob.companyId) : null;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-neutral mb-6">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => {
              const company = companies.find(c => c.id === job.companyId);
              if (!company) return null;
              return (
                <JobCard 
                  key={job.id}
                  job={job}
                  company={company}
                  onApply={handleApply}
                  onViewDetails={handleViewDetails}
                  isApplied={appliedJobs.includes(job.id)}
                />
              );
            })}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-6 rounded-lg shadow-md border relative">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-primary transition-colors"
                aria-label="Edit Profile"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold text-neutral mb-4">Welcome, {seeker.name}!</h3>
              <img src={seeker.photoUrl} alt={seeker.name} className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-primary"/>
              <p className="text-center text-gray-600">{seeker.email}</p>
          </div>
          <ResumeBooster />
        </div>
      </div>

      {selectedJob && selectedJobCompany && (
        <Modal 
          isOpen={!!selectedJobId} 
          onClose={handleCloseModal} 
          title="Job Details"
        >
          <JobDetails 
            job={selectedJob} 
            company={selectedJobCompany}
            onApply={handleApply}
            isApplied={appliedJobs.includes(selectedJob.id)}
            userRole="seeker"
            onLeaveReview={handleLeaveReview}
          />
        </Modal>
      )}

      {reviewingCompany && (
        <Modal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            title={`Leave a review for ${reviewingCompany.name}`}
        >
            <LeaveReviewForm
                companyName={reviewingCompany.name}
                onSubmit={handleSubmitReview}
                onCancel={() => setIsReviewModalOpen(false)}
            />
        </Modal>
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Your Profile"
      >
        <JobSeekerProfileEdit
          seeker={seeker}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </main>
  );
};

export default SeekerDashboard;