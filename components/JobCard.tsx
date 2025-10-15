
import React from 'react';
import { Job, Company, JobType, LocationType } from '../types';
import { BriefcaseIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, GlobeAltIcon } from './icons';

interface JobCardProps {
  job: Job;
  company: Company;
  onApply: (jobId: number) => void;
  onViewDetails: (jobId: number) => void;
  isApplied: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, company, onApply, onViewDetails, isApplied }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 flex flex-col">
      <div className="flex items-start mb-4">
        <img src={company.logo} alt={`${company.name} logo`} className="h-16 w-16 rounded-full mr-4 object-cover border-2 border-primary-focus" />
        <div>
          <h3 className="text-xl font-bold text-neutral">{job.title}</h3>
          <p className="text-primary font-semibold">{company.name}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-gray-600 mb-4 flex-grow">
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
        </div>
         <div className="flex items-center">
          <BriefcaseIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>{job.experienceLevel}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{job.jobType}</span>
        <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">{job.locationType}</span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <button 
          onClick={() => onViewDetails(job.id)}
          className="text-primary font-semibold hover:underline"
        >
          View Details
        </button>
        <button
          onClick={() => onApply(job.id)}
          disabled={isApplied}
          className={`px-4 py-2 rounded-md font-bold text-white transition-colors duration-300 ${
            isApplied
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
