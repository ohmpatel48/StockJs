'use client';

import { useState } from 'react';
import { useAuth } from '../utils/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');  // Redirect to dashboard after login
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#60bfbe]">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 ml-3">
        <img
          src="/stock.jpg" // Replace with your image path
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl ring-1 ring-gray-900/5">
          <h1 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#60bfbe]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#60bfbe]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-4 text-black bg-[#60bfbe] rounded-md shadow hover:bg-[#509f9e] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#60bfbe]"
            >
              Log In
            </button>
          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
