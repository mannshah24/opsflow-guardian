import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import CompanyOnboarding from '@/components/onboarding/CompanyOnboarding';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('opsflow-onboarding-completed');
        const isFirstTimeUser = localStorage.getItem('opsflow-first-time-user');
        const hasProfile = await apiService.getCompanyProfile();
        
        // Show onboarding if:
        // 1. First time user (has first-time flag)
        // 2. No onboarding completion flag
        // 3. No company profile exists
        if ((isFirstTimeUser && !hasCompletedOnboarding) || (!hasCompletedOnboarding && !hasProfile)) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // Check if it's a first-time user even on error
        const isFirstTimeUser = localStorage.getItem('opsflow-first-time-user');
        const hasCompletedOnboarding = localStorage.getItem('opsflow-onboarding-completed');
        if (isFirstTimeUser && !hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('opsflow-onboarding-completed', 'true');
    localStorage.removeItem('opsflow-first-time-user'); // Clear first-time user flag
    setShowOnboarding(false);
    
    // Navigate to dashboard after onboarding completion
    navigate('/dashboard');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('opsflow-onboarding-completed', 'true');
    localStorage.removeItem('opsflow-first-time-user'); // Clear first-time user flag
    setShowOnboarding(false);
    
    // Navigate to dashboard after skipping onboarding
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {showOnboarding && (
        <CompanyOnboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </>
  );
};

export default OnboardingWrapper;
