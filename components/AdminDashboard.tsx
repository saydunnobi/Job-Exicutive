import React from 'react';
import { Job, Company, JobSeeker } from '../types';
import { BriefcaseIcon, BuildingOfficeIcon, TrashIcon, UsersIcon } from './icons';

interface AdminDashboardProps {
  jobs: Job[];
  companies: Company[];
  seekers: JobSeeker[];
  onDeleteJob: (jobId: number) => void;
  onDeleteCompany: (companyId: number) => void;
  onDeleteSeeker: (seekerId: number) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border flex items-center">
        <div className="p-3 rounded-full bg-primary/10 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-neutral">{value}</p>
        </div>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, companies, seekers, onDeleteJob, onDeleteCompany, onDeleteSeeker }) => {

  const handleDelete = (type: 'job' | 'company' | 'seeker', id: number) => {
      if (window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
          if (type === 'job') onDeleteJob(id);
          if (type === 'company') onDeleteCompany(id);
          if (type === 'seeker') onDeleteSeeker(id);
      }
  }

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-8">
      <h2 className="text-3xl font-bold text-neutral">Admin Dashboard</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Jobs" value={jobs.length} icon={<BriefcaseIcon className="h-8 w-8 text-primary"/>} />
        <StatCard title="Total Companies" value={companies.length} icon={<BuildingOfficeIcon className="h-8 w-8 text-primary"/>} />
        <StatCard title="Total Job Seekers" value={seekers.length} icon={<UsersIcon className="h-8 w-8 text-primary"/>} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-bold text-neutral mb-4">Manage Jobs</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {jobs.map(job => (
              <div key={job.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-500">{companies.find(c => c.id === job.companyId)?.name}</p>
                </div>
                <button onClick={() => handleDelete('job', job.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-bold text-neutral mb-4">Manage Companies</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {companies.map(company => (
              <div key={company.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                <p className="font-semibold">{company.name}</p>
                <button onClick={() => handleDelete('company', company.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border lg:col-span-2">
          <h3 className="text-xl font-bold text-neutral mb-4">Manage Job Seekers</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {seekers.map(seeker => (
              <div key={seeker.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{seeker.name}</p>
                  <p className="text-sm text-gray-500">{seeker.email}</p>
                </div>
                <button onClick={() => handleDelete('seeker', seeker.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;