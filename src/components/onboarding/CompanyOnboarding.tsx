import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  Cog, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface CompanyOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const CompanyOnboarding: React.FC<CompanyOnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Add escape key functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || (event.ctrlKey && event.key === 'h')) {
        console.log('Escape key pressed - skipping onboarding');
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    size: '',
    primaryGoals: [] as string[],
    automationNeeds: [] as string[],
    techStack: [] as string[],
    businessProcesses: [] as string[],
    description: ''
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Consulting',
    'Real Estate',
    'Other'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const goalOptions = [
    'Reduce manual tasks',
    'Improve efficiency',
    'Cost reduction',
    'Better data insights',
    'Compliance automation',
    'Customer service automation',
    'Quality assurance',
    'Scalability improvements'
  ];

  const automationNeeds = [
    'Data processing',
    'Report generation',
    'Email automation',
    'File management',
    'System integration',
    'Quality control',
    'Customer support',
    'Inventory management',
    'Financial processes',
    'HR processes'
  ];

  const techStackOptions = [
    'Microsoft Office',
    'Google Workspace',
    'Salesforce',
    'ServiceNow',
    'SAP',
    'Oracle',
    'AWS',
    'Azure',
    'Slack',
    'Jira',
    'Custom databases',
    'CRM systems'
  ];

  const businessProcesses = [
    'Customer onboarding',
    'Invoice processing',
    'Data entry',
    'Quality audits',
    'Inventory tracking',
    'Employee onboarding',
    'Expense reporting',
    'Contract management',
    'Compliance monitoring',
    'Performance reporting'
  ];

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleNext = () => {
    console.log(`Current step: ${currentStep}, Can proceed step 3: ${canProceedStep3}`);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      console.log(`Moving to step: ${currentStep + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting company profile:', formData);
    setLoading(true);
    try {
      await apiService.saveCompanyProfile(formData);
      
      toast({
        title: "Profile Completed!",
        description: "Your company profile has been saved. OpsFlow Guardian will now provide tailored automation suggestions.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Failed to save company profile:', error);
      toast({
        title: "Save Failed - But Continuing Anyway",
        description: "Profile couldn't be saved to server, but you can continue to dashboard.",
        variant: "destructive",
      });
      
      // Continue to dashboard even if save fails
      setTimeout(() => {
        onComplete();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Emergency bypass function
  const handleEmergencySkip = () => {
    console.log('Emergency skip triggered');
    toast({
      title: "Skipping Setup",
      description: "Going directly to dashboard...",
    });
    onSkip();
  };

  const canProceedStep1 = formData.companyName.trim() && formData.industry && formData.size;
  const canProceedStep2 = formData.primaryGoals.length > 0;
  const canProceedStep3 = true; // Allow proceeding to step 4 even with no selections (optional fields)
  const canComplete = true; // Always allow completion from step 4 (all fields are optional in final step)

  // Debug logging - Enhanced
  useEffect(() => {
    console.log('🔍 Onboarding Debug State Update:', {
      currentStep,
      canProceedStep1,
      canProceedStep2, 
      canProceedStep3,
      canComplete,
      loading,
      showingStep4: currentStep === 4,
      formData: {
        companyName: formData.companyName,
        industry: formData.industry,
        size: formData.size,
        primaryGoalsCount: formData.primaryGoals.length,
        automationNeedsCount: formData.automationNeeds.length,
        businessProcessesCount: formData.businessProcesses.length,
      }
    });
    
    if (currentStep === 4) {
      console.log('✅ STEP 4 ACTIVE - Complete Setup button should be visible!');
    }
  }, [currentStep, canProceedStep1, canProceedStep2, canProceedStep3, canComplete, loading, formData]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-2xl glass-card border-0 shadow-2xl my-8">
          <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <div></div> {/* Spacer */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl gradient-text">Welcome to OpsFlow Guardian</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-xs text-foreground-muted hover:text-foreground"
            >
              Skip to Dashboard
            </Button>
          </div>
          
          {/* EMERGENCY DEBUG SECTION */}
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-xs text-red-800 space-y-1">
              <div><strong>DEBUG:</strong> Current Step = {currentStep}</div>
              <div className="flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setCurrentStep(4)}
                  className="text-xs"
                >
                  Jump to Step 4
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSubmit}
                  className="text-xs bg-green-100"
                >
                  Force Complete
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onSkip}
                  className="text-xs bg-blue-100"
                >
                  Emergency Skip
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-foreground-muted">
            Let's personalize your automation experience by learning about your company
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-background-subtle text-foreground-muted'}
                `}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-background-subtle'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Company Basics */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Tell us about your company</h3>
                <p className="text-sm text-foreground-muted">Basic information to get started</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Company Size *</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">What are your primary goals?</h3>
                <p className="text-sm text-foreground-muted">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <div
                    key={goal}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all hover:bg-background/50
                      ${formData.primaryGoals.includes(goal) ? 'bg-primary/10 border-primary/50' : 'border-border/50'}
                    `}
                    onClick={() => handleArrayToggle('primaryGoals', goal)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={formData.primaryGoals.includes(goal)}
                        onChange={() => {}}
                      />
                      <span className="text-sm">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Automation Needs & Tech Stack */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Cog className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Automation preferences</h3>
                <p className="text-sm text-foreground-muted">Help us understand your needs</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">What would you like to automate?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {automationNeeds.map((need) => (
                    <Badge
                      key={need}
                      variant={formData.automationNeeds.includes(need) ? "default" : "outline"}
                      className="cursor-pointer p-2 justify-start"
                      onClick={() => handleArrayToggle('automationNeeds', need)}
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Current tech stack (optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {techStackOptions.map((tech) => (
                    <Badge
                      key={tech}
                      variant={formData.techStack.includes(tech) ? "default" : "outline"}
                      className="cursor-pointer p-2 justify-start"
                      onClick={() => handleArrayToggle('techStack', tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Business Processes & Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Business processes</h3>
                <p className="text-sm text-foreground-muted">What processes can we help automate?</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Key business processes</Label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {businessProcesses.map((process) => (
                    <Badge
                      key={process}
                      variant={formData.businessProcesses.includes(process) ? "default" : "outline"}
                      className="cursor-pointer p-2 justify-start"
                      onClick={() => handleArrayToggle('businessProcesses', process)}
                    >
                      {process}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional context (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about your automation needs, specific challenges, or goals..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="glass-input min-h-[100px]"
                />
              </div>

              {/* Summary Table */}
              <div className="bg-background/30 p-6 rounded-lg border border-border/20">
                <h4 className="font-semibold mb-4 text-lg text-card-foreground">Company Profile Summary</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company Information Table */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-primary">Company Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Company Name:</span>
                          <span className="font-medium text-card-foreground">{formData.companyName || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Industry:</span>
                          <span className="font-medium text-card-foreground">{formData.industry || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Company Size:</span>
                          <span className="font-medium text-card-foreground">{formData.size || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Automation Configuration Table */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-primary">Automation Configuration</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Primary Goals:</span>
                          <span className="font-medium text-card-foreground">{formData.primaryGoals.length} selected</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Automation Needs:</span>
                          <span className="font-medium text-card-foreground">{formData.automationNeeds.length} selected</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Tech Stack:</span>
                          <span className="font-medium text-card-foreground">{formData.techStack.length} tools</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/10">
                          <span className="text-foreground-muted">Business Processes:</span>
                          <span className="font-medium text-card-foreground">{formData.businessProcesses.length} processes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Items Details */}
                  {formData.primaryGoals.length > 0 && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h6 className="font-medium text-primary mb-2">Selected Goals:</h6>
                      <div className="flex flex-wrap gap-1">
                        {formData.primaryGoals.map((goal) => (
                          <Badge key={goal} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/30">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.automationNeeds.length > 0 && (
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <h6 className="font-medium text-success mb-2">Automation Priorities:</h6>
                      <div className="flex flex-wrap gap-1">
                        {formData.automationNeeds.map((need) => (
                          <Badge key={need} variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.description && (
                    <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                      <h6 className="font-medium text-info mb-2">Additional Context:</h6>
                      <p className="text-sm text-foreground-muted italic">"{formData.description}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons - ALWAYS VISIBLE */}
          <div className="flex gap-3 pt-6 border-t border-border/20 min-h-[80px] items-center"
               style={{ 
                 borderRadius: '0 0 var(--radius) var(--radius)',
               }}>
            
            {/* Left Button */}
            {currentStep === 1 ? (
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1 min-h-[48px] text-sm font-medium"
                disabled={loading}
              >
                Skip for now
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
                className="flex-1 min-h-[48px] text-sm font-medium"
              >
                ← Previous
              </Button>
            )}

            {/* Right Button(s) */}
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={loading || (currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)}
                className="flex-1 bg-primary hover:bg-primary-dark min-h-[48px] text-sm font-medium"
                title={`Step ${currentStep}: Continue to step ${currentStep + 1}`}
              >
                {currentStep === 3 ? 'Continue to Final Step' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              /* STEP 4 BUTTONS - ALWAYS SHOW */
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 min-h-[48px] text-sm font-medium text-white shadow-lg"
                  title="Save your company profile and continue to dashboard"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Setup
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleEmergencySkip}
                  variant="outline"
                  disabled={loading}
                  className="px-6 min-h-[48px] text-sm font-medium border-2"
                  title="Skip saving and go directly to dashboard"
                >
                  Skip →
                </Button>
              </>
            )}
            
          </div>
          
          {/* Debug Info for Step 4 */}
          {currentStep === 4 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <strong>Debug:</strong> Step {currentStep} - Complete Setup button should be visible above
            </div>
          )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
