
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (userType: 'seeker' | 'company') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'seeker' | 'company'>('seeker');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have actual authentication logic here.
    // For this demo, we'll just call the onLogin callback.
    if (email && password) {
      onLogin(userType);
    } else {
      alert('Please enter email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                Sign in as a:
              </span>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-primary" name="userType" value="seeker" checked={userType === 'seeker'} onChange={() => setUserType('seeker')} />
                  <span className="ml-2">Job Seeker</span>
                </label>
                 <label className="inline-flex items-center">
                  <input type="radio" className="form-radio text-primary" name="userType" value="company" checked={userType === 'company'} onChange={() => setUserType('company')} />
                  <span className="ml-2">Company</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
