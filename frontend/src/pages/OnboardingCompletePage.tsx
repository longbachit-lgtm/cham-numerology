import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { updateProfile, computeNumerology } from '../services/api';

export default function OnboardingCompletePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    handleComplete();
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      const fullName = sessionStorage.getItem('onboarding_name') || '';
      const dob = sessionStorage.getItem('onboarding_dob') || '';
      const gender = sessionStorage.getItem('onboarding_gender') as any;
      const jobField = sessionStorage.getItem('onboarding_jobField') || '';
      const jobRole = sessionStorage.getItem('onboarding_jobRole') || '';

      if (!fullName || !dob) {
        throw new Error('Missing required information');
      }

      // Update profile
      if (isAuthenticated) {
        await updateProfile({
          fullName,
          dob,
          gender,
          jobField,
          jobRole,
          tz: 'Asia/Bangkok',
        });

        setProfile({ fullName, dob, gender, jobField, jobRole, tz: 'Asia/Bangkok' });

        // Compute numerology
        await computeNumerology();
      }

      // Clear session storage
      sessionStorage.removeItem('onboarding_name');
      sessionStorage.removeItem('onboarding_dob');
      sessionStorage.removeItem('onboarding_gender');
      sessionStorage.removeItem('onboarding_jobField');
      sessionStorage.removeItem('onboarding_jobRole');

      // Navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="card max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Step 4/4</span>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-primary-600 rounded"></div>
              <div className="w-12 h-1 bg-primary-600 rounded"></div>
              <div className="w-12 h-1 bg-primary-600 rounded"></div>
              <div className="w-12 h-1 bg-primary-600 rounded"></div>
            </div>
          </div>
        </div>

        {loading && !error && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating...</h2>
              <p className="text-gray-600">We are analyzing your info and preparing personalized guidance.</p>
            </div>

            <div className="bg-primary-50 p-4 rounded-xl">
              <p className="text-sm text-primary-800 italic">"You are stepping into a journey of self-discovery..."</p>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-6">
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
              {error}
            </div>
            <button
              onClick={handleComplete}
              className="btn btn-primary w-full"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
