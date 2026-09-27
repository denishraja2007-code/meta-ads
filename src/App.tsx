import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { WorkflowStepper } from './components/WorkflowStepper';
import { Step1Scope } from './components/Step1Scope';
import { CompanyInlineForm } from './components/CompanyInlineForm';
import { AddCompanyOrSkip } from './components/AddCompanyOrSkip';
import { Step3Results } from './components/Step3Results';
import { Step4Comparison } from './components/Step4Comparison';
import { DashboardView } from './components/DashboardView';
import { ReportView } from './components/ReportView';
import { AICopilotView } from './components/AICopilotView';
import { RecommendationsView } from './components/RecommendationsView';
import {
  CompanyDetails,
  CompetitorCompany,
  IntelligenceResult,
  LocationOption,
  TimePeriod,
  TrackOption,
  ComparisonReport,
} from './types';
import {
  getSavedCompanyDetails,
  saveCompanyDetails,
  clearSavedCompanyDetails,
} from './utils/storage';
import {
  generateIntelligenceData,
  generateComparisonReport,
} from './utils/mockIntelligence';
import { Sparkles, Bot, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'competitors' | 'dashboard' | 'recommendations' | 'copilot'
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Section 1: Scope
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | ''>('Country');
  const [locationName, setLocationName] = useState<string>('United States');
  const [selectedTrack, setSelectedTrack] = useState<TrackOption | ''>('Shoes');
  const [isScopeSubmitted, setIsScopeSubmitted] = useState<boolean>(false);

  // Section 2: First Company Details & Time Period
  const [firstCompany, setFirstCompany] = useState<CompanyDetails | null>(null);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>('Monthly');
  const [isFirstCompanySubmitted, setIsFirstCompanySubmitted] = useState<boolean>(false);
  const [isEditingFirstCompany, setIsEditingFirstCompany] = useState<boolean>(false);

  // Section 3: Add Company or Skip Option
  const [showSecondCompanyForm, setShowSecondCompanyForm] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isLoadingSkip, setIsLoadingSkip] = useState<boolean>(false);

  // Section 4: Second Company Details
  const [secondCompany, setSecondCompany] = useState<CompanyDetails | null>(null);
  const [isSecondCompanySubmitted, setIsSecondCompanySubmitted] = useState<boolean>(false);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState<boolean>(false);

  // Section 5A & 5B: Results
  const [singleResult, setSingleResult] = useState<IntelligenceResult | null>(null);
  const [comparisonReport, setComparisonReport] = useState<ComparisonReport | null>(null);
  const [isEmptyState, setIsEmptyState] = useState<boolean>(false);

  // Section element refs for smooth progressive scrolling
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load saved company details from localStorage on mount
  useEffect(() => {
    const saved = getSavedCompanyDetails();
    if (saved) {
      setFirstCompany(saved);
      setHasSavedData(true);
      if (saved.track) {
        setSelectedTrack(saved.track as TrackOption);
      }
    }
  }, []);

  // Compute current stage for stepper
  const currentStage = comparisonReport || singleResult ? 4 : showSecondCompanyForm || isFirstCompanySubmitted ? 3 : isScopeSubmitted ? 2 : 1;
  const completedStages = [
    ...(isScopeSubmitted ? [1] : []),
    ...(isFirstCompanySubmitted ? [2] : []),
    ...(isSkipped || isSecondCompanySubmitted ? [3] : []),
    ...(singleResult || comparisonReport ? [4] : []),
  ];

  // Handler for Section 1 (Location & Track) Submit
  const handleScopeSubmit = (
    location: LocationOption,
    locName: string,
    track: TrackOption
  ) => {
    setSelectedLocation(location);
    setLocationName(locName);
    setSelectedTrack(track);
    setIsScopeSubmitted(true);

    setTimeout(() => {
      section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handler for Section 2 (First Company Details) Submit
  // Strictly: "after entering the company details, show only the Submit button — do not generate the result immediately."
  const handleSubmitFirstCompany = (details: CompanyDetails) => {
    setFirstCompany(details);
    saveCompanyDetails(details);
    setHasSavedData(true);
    setIsFirstCompanySubmitted(true);
    setIsEditingFirstCompany(false);

    // If results were previously generated, update them
    if (singleResult) {
      const refreshed = generateIntelligenceData(
        details,
        (selectedLocation as LocationOption) || 'Country',
        locationName,
        selectedTrack || 'Shoes',
        selectedTimePeriod
      );
      setSingleResult(refreshed);
    }

    setTimeout(() => {
      section3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleResetSavedCompany = () => {
    clearSavedCompanyDetails();
    setFirstCompany(null);
    setHasSavedData(false);
  };

  // Handler for Section 3: "Skip" button
  // "If the user selects Skip, the result should be generated based on the first company’s details."
  const handleSelectSkip = () => {
    if (!firstCompany) return;
    setIsSkipped(true);
    setShowSecondCompanyForm(false);
    setComparisonReport(null);
    setIsLoadingSkip(true);

    setTimeout(() => {
      const result = generateIntelligenceData(
        firstCompany,
        (selectedLocation as LocationOption) || 'Country',
        locationName,
        selectedTrack || 'Shoes',
        selectedTimePeriod
      );
      setSingleResult(result);
      setIsLoadingSkip(false);
      setIsEmptyState(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 500);
  };

  // Handler for Section 3: "Add Company" button
  // "If the user selects Add Company, another form should appear below it to enter the second company’s details."
  const handleSelectAddCompany = () => {
    setShowSecondCompanyForm(true);
    setIsSkipped(false);
    setSingleResult(null);

    setTimeout(() => {
      section4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  // Handler for Section 4: "Submit" button on Second Company Form
  const handleSubmitSecondCompany = (details: CompanyDetails) => {
    setSecondCompany(details);
    setIsSecondCompanySubmitted(true);
  };

  // Handler for Section 4: "Generate" button on Second Company Form
  // "Below the second company form, there should be Submit and Generate buttons.
  // Once the user clicks Generate, the comparison result between the companies should be generated."
  const handleGenerateComparison = (details: CompanyDetails) => {
    if (!firstCompany) return;
    setSecondCompany(details);
    setIsSecondCompanySubmitted(true);
    setIsGeneratingComparison(true);
    setSingleResult(null);

    const compEntry: CompetitorCompany = {
      ...details,
      id: 'comp_second_brand',
      addedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const report = generateComparisonReport(
        firstCompany,
        [compEntry],
        (selectedLocation as LocationOption) || 'Country',
        selectedTrack || 'Shoes',
        selectedTimePeriod
      );
      setComparisonReport(report);
      setIsGeneratingComparison(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  // Changing period on the fly
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setSelectedTimePeriod(newPeriod);
    if (singleResult && firstCompany) {
      const refreshed = generateIntelligenceData(
        firstCompany,
        (selectedLocation as LocationOption) || 'Country',
        locationName,
        selectedTrack || 'Shoes',
        newPeriod
      );
      setSingleResult(refreshed);
    }
    if (comparisonReport && firstCompany && secondCompany) {
      const compEntry: CompetitorCompany = {
        ...secondCompany,
        id: 'comp_second_brand',
        addedAt: new Date().toISOString(),
      };
      const refreshedReport = generateComparisonReport(
        firstCompany,
        [compEntry],
        (selectedLocation as LocationOption) || 'Country',
        selectedTrack || 'Shoes',
        newPeriod
      );
      setComparisonReport(refreshedReport);
    }
  };

  const handleResetWorkflow = () => {
    setIsScopeSubmitted(false);
    setIsFirstCompanySubmitted(false);
    setShowSecondCompanyForm(false);
    setIsSkipped(false);
    setSecondCompany(null);
    setIsSecondCompanySubmitted(false);
    setSingleResult(null);
    setComparisonReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveNavTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080914] text-slate-200 relative selection:bg-purple-600 selection:text-white font-sans flex flex-col lg:flex-row">
      {/* Background ambient radial gradients matching OptivaOne */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, oklch(0.62 0.24 295 / 0.25), transparent 45%), radial-gradient(circle at 75% 60%, oklch(0.55 0.24 265 / 0.2), transparent 45%)',
        }}
        aria-hidden="true"
      />

      {/* OptivaOne Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d0e20]/80 backdrop-blur-xl z-20 sticky top-0">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2.5 text-left"
        >
          <img
            src="/logo.png"
            alt="OptivaOne logo"
            className="h-8 w-8 rounded-lg object-cover shadow-glow border border-purple-500/30"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-semibold text-sm text-white">OptivaOne</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveNavTab('home')}
            className={`px-2.5 py-1 rounded-lg ${activeNavTab === 'home' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setActiveNavTab('competitors')}
            className={`px-2.5 py-1 rounded-lg ${activeNavTab === 'competitors' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* OptivaOne Sidebar for Desktop & Mobile Drawer */}
      <Sidebar
        activeTab={activeNavTab}
        onTabChange={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 relative z-10 overflow-y-auto">
        {/* VIEW 1: HOME PAGE (Matching the 3 uploaded screenshots) */}
        {activeNavTab === 'home' && (
          <HomePage
            onNavigateToCompetitors={() => {
              setActiveNavTab('competitors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToDashboard={() => {
              setActiveNavTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToReport={() => {
              setActiveNavTab('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRecommendations={() => {
              setActiveNavTab('recommendations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCopilot={() => {
              setActiveNavTab('copilot');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          />
        )}

        {/* VIEW 2: COMPETITOR INTELLIGENCE WORKFLOW */}
        {activeNavTab === 'competitors' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
            {/* Header: Back, Home & 03 · COMPETITOR INTELLIGENCE */}
            <Header
              onBack={() => {
                if (isScopeSubmitted) {
                  handleResetWorkflow();
                } else {
                  handleGoHome();
                }
              }}
              onHome={handleGoHome}
              canGoBack={true}
            />

            {/* Stepper Progress */}
            <WorkflowStepper
              currentStage={currentStage}
              completedStages={completedStages}
            />

            {/* SECTION 1: Select Location & Select Track */}
            <div id="section-1">
              <Step1Scope
                initialLocation={selectedLocation}
                initialLocationName={locationName}
                initialTrack={selectedTrack}
                onSubmit={handleScopeSubmit}
              />
            </div>

            {/* SECTION 2: First Company Details & Time Period */}
            {isScopeSubmitted && (
              <div ref={section2Ref} id="section-2" className="animate-in fade-in duration-200">
                <CompanyInlineForm
                  formNumber={1}
                  title="Enter First Company Details"
                  subtitle="Provide the primary company profile URLs and evaluation time period."
                  defaultTrack={selectedTrack || 'Shoes'}
                  initialDetails={firstCompany}
                  includeTimePeriod={true}
                  selectedTimePeriod={selectedTimePeriod}
                  onTimePeriodChange={handlePeriodChange}
                  onSubmitOnly={handleSubmitFirstCompany}
                  isSubmitted={isFirstCompanySubmitted && !isEditingFirstCompany}
                  onEdit={() => setIsEditingFirstCompany(true)}
                  hasSavedData={hasSavedData}
                  onResetSavedData={handleResetSavedCompany}
                />
              </div>
            )}

            {/* SECTION 3: Add Company & Skip Option */}
            {isFirstCompanySubmitted && firstCompany && (
              <div ref={section3Ref} id="section-3" className="animate-in fade-in duration-200">
                <AddCompanyOrSkip
                  firstCompanyName={firstCompany.companyName}
                  onAddCompany={handleSelectAddCompany}
                  onSkip={handleSelectSkip}
                  hasSecondCompany={showSecondCompanyForm}
                  isSkipped={isSkipped}
                  isLoadingSkip={isLoadingSkip}
                />
              </div>
            )}

            {/* SECTION 4: Second Company Form */}
            {showSecondCompanyForm && firstCompany && (
              <div ref={section4Ref} id="section-4" className="animate-in fade-in duration-200 space-y-4">
                <CompanyInlineForm
                  formNumber={2}
                  title="Enter Second Company Details"
                  subtitle={`Provide profile URLs for the competitor brand to compare against ${firstCompany.companyName}.`}
                  defaultTrack={selectedTrack || 'Shoes'}
                  initialDetails={secondCompany}
                  includeTimePeriod={false}
                  onSubmitSecond={handleSubmitSecondCompany}
                  onGenerateComparison={handleGenerateComparison}
                  isSubmitted={isSecondCompanySubmitted}
                  isGenerating={isGeneratingComparison}
                />

                {isSecondCompanySubmitted && !comparisonReport && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
                    <span>Second company details have been submitted. Click "Generate" to view comparison.</span>
                    <button
                      type="button"
                      onClick={() => secondCompany && handleGenerateComparison(secondCompany)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors cursor-pointer"
                    >
                      Generate Comparison
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5A: Single Company Performance Analysis (when Skip is selected) */}
            {isSkipped && singleResult && !showSecondCompanyForm && (
              <div ref={resultsRef} id="section-5a">
                <Step3Results
                  data={singleResult}
                  isLoading={isLoadingSkip}
                  isEmptyState={isEmptyState}
                  onToggleEmptyState={() => setIsEmptyState((prev) => !prev)}
                  onResetFilters={handleResetWorkflow}
                  timePeriod={selectedTimePeriod}
                  onTimePeriodChange={handlePeriodChange}
                />
              </div>
            )}

            {/* SECTION 5B: Comparison Results (when Generate is clicked below Second Company Form) */}
            {comparisonReport && firstCompany && secondCompany && showSecondCompanyForm && (
              <div ref={resultsRef} id="section-5b">
                <Step4Comparison
                  report={comparisonReport}
                  ourCompany={firstCompany}
                  secondCompany={secondCompany}
                  onResetAll={handleResetWorkflow}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: DASHBOARD OPTION (Matching the 8 uploaded screenshots) */}
        {activeNavTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <DashboardView
              firstCompany={firstCompany}
              secondCompany={secondCompany}
              onBack={() => {
                setActiveNavTab('competitors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onHome={handleGoHome}
            />
          </div>
        )}

        {/* VIEW 3B: REPORT OPTION (New Performance Analytics Report Page) */}
        {activeNavTab === 'report' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <ReportView
              firstCompany={firstCompany}
              secondCompany={secondCompany}
              track={selectedTrack || 'Shoes'}
              onBack={() => {
                setActiveNavTab('competitors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onHome={handleGoHome}
              onNavigateToRecommendations={() => {
                setActiveNavTab('recommendations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW 4: RECOMMENDATIONS OPTION (Action Desk) */}
        {activeNavTab === 'recommendations' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <RecommendationsView
              firstCompany={firstCompany}
              secondCompany={secondCompany}
              track={selectedTrack || 'Shoes'}
              onBack={() => {
                setActiveNavTab('competitors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onHome={handleGoHome}
              onAskCopilot={(query: string) => {
                if (query) {
                  setCopilotInitialQuery(query);
                }
                setActiveNavTab('copilot');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW 5: AI COPILOT OPTION (Premier AI Assistant) */}
        {activeNavTab === 'copilot' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <AICopilotView
              firstCompany={firstCompany}
              secondCompany={secondCompany}
              track={selectedTrack || 'Shoes'}
              location={`${selectedLocation || 'Country'} · ${locationName || 'United States'}`}
              timePeriod={selectedTimePeriod}
              singleResult={singleResult}
              comparisonReport={comparisonReport}
              initialQuery={copilotInitialQuery}
              onBack={() => {
                setActiveNavTab('competitors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onHome={handleGoHome}
              onNavigateToCompetitors={() => {
                setActiveNavTab('competitors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Quiet footer matching OptivaOne design language */}
        <footer className="border-t border-white/5 py-8 mt-16 text-center text-xs text-slate-500">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>OptivaOne · Intelligence Engine</span>
            <span>All metrics updated in real-time across social & domain endpoints</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
