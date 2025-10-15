import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SeekerDashboard from './components/SeekerDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import { JobSeeker, Company, Admin, Job, Review } from './types';
import { api } from './services/apiService';

type User = JobSeeker | Company | Admin;
type UserRole = 'seeker' | 'company' | 'admin';

const App: React.FC = () => {
    // Data State
    const [seekers, setSeekers] = useState<JobSeeker[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            const [seekersData, companiesData, jobsData] = await Promise.all([
                api.getSeekers(),
                api.getCompanies(),
                api.getJobs()
            ]);
            setSeekers(seekersData);
            setCompanies(companiesData);
            setJobs(jobsData);
        };
        
        // Persist login session
        const storedUser = sessionStorage.getItem('currentUser');
        const storedRole = sessionStorage.getItem('currentUserRole');
        if (storedUser && storedRole) {
            setCurrentUser(JSON.parse(storedUser));
            setCurrentUserRole(storedRole as UserRole);
        }
        
        loadData().finally(() => setIsLoading(false));
    }, []);

    const handleLogin = async (email: string, password: string, role: UserRole) => {
        setAuthError(null);
        const result = await api.authenticateUser(email, password, role);

        if ('user' in result) {
            setCurrentUser(result.user);
            setCurrentUserRole(result.role);
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            sessionStorage.setItem('currentUserRole', result.role);
            // If a new user was created, we need to refresh our user lists
            if (role === 'seeker' && !seekers.find(s => s.id === result.user.id)) {
                setSeekers(prev => [...prev, result.user as JobSeeker]);
            }
            if (role === 'company' && !companies.find(c => c.id === result.user.id)) {
                setCompanies(prev => [...prev, result.user as Company]);
            }
        } else {
            setAuthError(result.error);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentUserRole(null);
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserRole');
    };
    
    const handleSaveSeekerProfile = async (updatedSeeker: JobSeeker) => {
      const savedSeeker = await api.updateSeeker(updatedSeeker);
      setSeekers(seekers.map(s => s.id === savedSeeker.id ? savedSeeker : s));
      setCurrentUser(savedSeeker);
      sessionStorage.setItem('currentUser', JSON.stringify(savedSeeker));
    }

    const handleSaveCompanyProfile = async (updatedCompany: Company) => {
      const savedCompany = await api.updateCompany(updatedCompany);
      setCompanies(companies.map(c => c.id === savedCompany.id ? savedCompany : c));
      setCurrentUser(savedCompany);
      sessionStorage.setItem('currentUser', JSON.stringify(savedCompany));
    }

    const handleAddReview = async (companyId: number, review: Omit<Review, 'id' | 'date'>) => {
      const updatedCompany = await api.addReview(companyId, review);
      setCompanies(companies.map(c => c.id === companyId ? updatedCompany : c));
    }
    
    const handlePostJob = async (jobData: Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>) => {
        const newJob = await api.postJob(jobData);
        setJobs(prev => [newJob, ...prev]);
    }
    
    const handleAdminDelete = async (type: 'job' | 'company' | 'seeker', id: number) => {
        if (await api.deleteEntity(type, id)) {
            if (type === 'job') setJobs(jobs.filter(j => j.id !== id));
            if (type === 'seeker') setSeekers(seekers.filter(s => s.id !== id));
            if (type === 'company') {
                setCompanies(companies.filter(c => c.id !== id));
                // Also remove jobs associated with that company
                setJobs(jobs.filter(j => j.companyId !== id));
            }
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser || !currentUserRole) {
        return <LoginPage onLogin={handleLogin} error={authError} />;
    }

    const renderDashboard = () => {
        switch (currentUserRole) {
            case 'seeker':
                return <SeekerDashboard 
                    seeker={currentUser as JobSeeker}
                    jobs={jobs}
                    companies={companies}
                    onAddReview={handleAddReview}
                    onSaveProfile={handleSaveSeekerProfile}
                />;
            case 'company':
                return <CompanyDashboard 
                    company={currentUser as Company}
                    jobs={jobs}
                    seekers={seekers}
                    onSaveProfile={handleSaveCompanyProfile}
                    onPostJob={handlePostJob}
                />;
            case 'admin':
                return <AdminDashboard 
                    jobs={jobs}
                    companies={companies}
                    seekers={seekers}
                    onDeleteJob={(id) => handleAdminDelete('job', id)}
                    onDeleteCompany={(id) => handleAdminDelete('company', id)}
                    onDeleteSeeker={(id) => handleAdminDelete('seeker', id)}
                />;
            default:
                return <LoginPage onLogin={handleLogin} error={authError} />;
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-primary">JobFlow</h1>
                        </div>
                        <div>
                           <button onClick={handleLogout} className="font-semibold text-neutral hover:text-primary transition-colors">Logout</button>
                        </div>
                    </div>
                </nav>
            </header>
            {renderDashboard()}
        </div>
    );
};

export default App;
