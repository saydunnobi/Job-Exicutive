import React, { useState } from 'react';
import { Job, JobType, LocationType } from '../types';

interface PostJobFormProps {
  companyId: number;
  onPostJob: (newJob: Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>) => void;
  onCancel: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ companyId, onPostJob, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    experienceLevel: '',
    salaryMin: 0,
    salaryMax: 0,
    jobType: JobType.FullTime,
    locationType: LocationType.Onsite,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['salaryMin', 'salaryMax'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.salaryMin > formData.salaryMax) {
        alert("Minimum salary cannot be greater than maximum salary.");
        return;
    }
    onPostJob({ ...formData, companyId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
            <input type="text" name="experienceLevel" id="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">Min Salary ($)</label>
            <input type="number" name="salaryMin" id="salaryMin" value={formData.salaryMin} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">Max Salary ($)</label>
            <input type="number" name="salaryMax" id="salaryMax" value={formData.salaryMax} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
            <select name="jobType" id="jobType" value={formData.jobType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-gray-700">Location Type</label>
            <select name="locationType" id="locationType" value={formData.locationType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {Object.values(LocationType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Cancel
        </button>
        <button type="submit" className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-md transition-colors">
            Post Job
        </button>
      </div>
    </form>
  );
};

export default PostJobForm;
