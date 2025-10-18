import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SeekerDashboard from './components/SeekerDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import { JobSeeker, Company, Admin, Job, Review, BlogPost } from './types';
import { api } from './services/apiService';
import BlogPage from './components/BlogPage';
import { BriefcaseIcon, NewspaperIcon } from './components/icons';

type User = JobSeeker | Company | Admin;
type UserRole = 'seeker' | 'company' | 'admin';
type ActiveView = 'dashboard' | 'blog';

const App: React.FC = () => {
    // Data State
    const [seekers, setSeekers] = useState<JobSeeker[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            const [seekersData, companiesData, jobsData, postsData] = await Promise.all([
                api.getSeekers(),
                api.getCompanies(),
                api.getJobs(),
                api.getBlogPosts(),
            ]);
            setSeekers(seekersData);
            setCompanies(companiesData);
            setJobs(jobsData);
            setBlogPosts(postsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
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
      const savedSeeker = await api.saveSeeker(updatedSeeker);
      setSeekers(seekers.map(s => s.id === savedSeeker.id ? savedSeeker : s));
      setCurrentUser(savedSeeker);
      sessionStorage.setItem('currentUser', JSON.stringify(savedSeeker));
    }

    const handleSaveCompanyProfile = async (updatedCompany: Company) => {
      const savedCompany = await api.saveCompany(updatedCompany);
      setCompanies(companies.map(c => c.id === savedCompany.id ? savedCompany : c));
      setCurrentUser(savedCompany);
      sessionStorage.setItem('currentUser', JSON.stringify(savedCompany));
    }

    const handleAddReview = async (companyId: number, review: Omit<Review, 'id' | 'date'>) => {
      const updatedCompany = await api.addReview(companyId, review);
      setCompanies(companies.map(c => c.id === companyId ? updatedCompany : c));
    }
    
    const handleCompanySaveJob = async (jobData: Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>) => {
        const newJob = await api.saveJob(jobData);
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

    const handleAdminSaveSeeker = async (seeker: JobSeeker) => {
        const savedSeeker = await api.saveSeeker(seeker);
        if (seekers.some(s => s.id === savedSeeker.id)) {
            setSeekers(seekers.map(s => s.id === savedSeeker.id ? savedSeeker : s));
        } else {
            setSeekers([...seekers, savedSeeker]);
        }
    };

    const handleAdminSaveCompany = async (company: Company) => {
        const savedCompany = await api.saveCompany(company);
        if (companies.some(c => c.id === savedCompany.id)) {
            setCompanies(companies.map(c => c.id === savedCompany.id ? savedCompany : c));
        } else {
            setCompanies([...companies, savedCompany]);
        }
    };
    
    const handleAdminSaveJob = async (job: Job | Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>) => {
        const savedJob = await api.saveJob(job);
        if (jobs.some(j => j.id === savedJob.id)) {
            setJobs(jobs.map(j => j.id === savedJob.id ? savedJob : j));
        } else {
            setJobs([savedJob, ...jobs]);
        }
    };
    
    const handleAddBlogPost = async (content: string) => {
        if (!currentUser || !currentUserRole) return;

        let authorName = 'Admin';
        let authorPhotoUrl = `https://i.pravatar.cc/150?u=admin`;

        if (currentUserRole === 'seeker') {
            authorName = (currentUser as JobSeeker).name;
            authorPhotoUrl = (currentUser as JobSeeker).photoUrl;
        } else if (currentUserRole === 'company') {
            authorName = (currentUser as Company).name;
            authorPhotoUrl = (currentUser as Company).logo;
        }

        const newPostData: Omit<BlogPost, 'id' | 'timestamp'> = {
            authorId: currentUser.id,
            authorName,
            authorRole: currentUserRole,
            authorPhotoUrl,
            content,
        };

        const savedPost = await api.addBlogPost(newPostData);
        setBlogPosts(prev => [savedPost, ...prev]);
    };

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
                    onSaveJob={handleCompanySaveJob}
                />;
            case 'admin':
                return <AdminDashboard 
                    jobs={jobs}
                    companies={companies}
                    seekers={seekers}
                    onDelete={handleAdminDelete}
                    onSaveSeeker={handleAdminSaveSeeker}
                    onSaveCompany={handleAdminSaveCompany}
                    onSaveJob={handleAdminSaveJob}
                />;
            default:
                return <LoginPage onLogin={handleLogin} error={authError} />;
        }
    }
    
    let currentUserName = 'Admin';
    let currentUserPhoto = `https://i.pravatar.cc/150?u=admin`;
    if (currentUserRole === 'seeker') {
        currentUserName = (currentUser as JobSeeker).name;
        currentUserPhoto = (currentUser as JobSeeker).photoUrl;
    } else if (currentUserRole === 'company') {
        currentUserName = (currentUser as Company).name;
        currentUserPhoto = (currentUser as Company).logo;
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-primary">Job Executive</h1>
                        </div>
                         <div className="hidden sm:block">
                            <div className="flex space-x-4">
                               <NavButton isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<BriefcaseIcon className="h-5 w-5 mr-2"/>}>Dashboard</NavButton>
                               <NavButton isActive={activeView === 'blog'} onClick={() => setActiveView('blog')} icon={<NewspaperIcon className="h-5 w-5 mr-2"/>}>Community Blog</NavButton>
                            </div>
                        </div>
                        <div>
                           <button onClick={handleLogout} className="font-semibold text-neutral hover:text-primary transition-colors">Logout</button>
                        </div>
                    </div>
                </nav>
            </header>
            
             <div className="sm:hidden p-2 bg-white shadow-md">
                 <div className="flex justify-around">
                     <NavButton isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<BriefcaseIcon className="h-5 w-5"/>}><span className="sr-only">Dashboard</span></NavButton>
                     <NavButton isActive={activeView === 'blog'} onClick={() => setActiveView('blog')} icon={<NewspaperIcon className="h-5 w-5"/>}><span className="sr-only">Blog</span></NavButton>
                 </div>
            </div>

            {activeView === 'dashboard' ? renderDashboard() : (
                <BlogPage 
                    posts={blogPosts}
                    onAddPost={handleAddBlogPost}
                    currentUserName={currentUserName}
                    currentUserPhoto={currentUserPhoto}
                />
            )}
        </div>
    );
};

const NavButton = ({ isActive, onClick, children, icon }: {isActive: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode}) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
         aria-current={isActive ? 'page' : undefined}
    >
        {icon}{children}
    </button>
);


export default App;
