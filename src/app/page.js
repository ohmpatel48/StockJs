"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './utils/auth'; // Import the auth utility

export default function Home() {
  const router = useRouter();
  const { user } = useAuth(); // Access the authenticated user from context

  useEffect(() => {
    // If user is logged in, redirect to dashboard, else go to login page
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div>
      <h1>Stock Price Tracker</h1>
      <p>Loading...</p>
    </div>
  );
}
