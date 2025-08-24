import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ui/error-boundary";
import OnboardingWrapper from "@/components/onboarding/OnboardingWrapper";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import Workflows from "./pages/Workflows";
import Approvals from "./pages/Approvals";
import Audit from "./pages/Audit";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import OAuthCallback from "./components/auth/OAuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - No Authentication Required */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            
            {/* Protected Routes - Authentication Required */}
            <Route path="/" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Navigate to="/dashboard" replace />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/dashboard" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Index />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/agents" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Agents />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/workflows" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Workflows />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/approvals" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Approvals />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/audit" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Audit />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/analytics" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Analytics />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Settings />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <OnboardingWrapper>
                  <Profile />
                </OnboardingWrapper>
              </AuthGuard>
            } />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
