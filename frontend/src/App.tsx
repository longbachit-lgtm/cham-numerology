import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';

// Pages
import LoginPage from './pages/LoginPage';
import OnboardingNamePage from './pages/OnboardingNamePage';
import OnboardingDOBPage from './pages/OnboardingDOBPage';
import OnboardingJobPage from './pages/OnboardingJobPage';
import OnboardingCompletePage from './pages/OnboardingCompletePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding/name" element={<OnboardingNamePage />} />
        <Route path="/onboarding/dob" element={<OnboardingDOBPage />} />
        <Route path="/onboarding/job" element={<OnboardingJobPage />} />
        <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  // Allow access even without auth in v1
  return <>{children}</>;
}

export default App;
