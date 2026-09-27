import React, { useState, useEffect, useCallback } from 'react';
import {
  CompanyProfile,
  PerformanceAnalytics,
  ReportingPeriod,
  SavedReport,
} from '../types/report';
import { CompanyDetails } from '../types';
import {
  fetchCompanies,
  fetchAnalyticsData,
  triggerLiveAnalyticsCollect,
  fetchSavedReports,
  saveReport,
  deleteSavedReport,
} from '../services/reportApi';
import { generateAndDownloadReportPDF } from '../utils/pdfGenerator';
import {
  PostingFrequencyBarChart,
  EngagementTrendsLineChart,
  EngagementBreakdownDonutChart,
} from './ReportCharts';
import { ReportModal } from './ReportModal';
import {
  ArrowLeft,
  Home,
  FileBarChart,
  RefreshCw,
  Eye,
  Download,
  Bookmark,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Globe,
  Share2,
  BarChart3,
  TrendingUp,
  Flame,
  Zap,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ReportViewProps {
  firstCompany?: CompanyDetails | null;
  secondCompany?: CompanyDetails | null;
  track?: string;
  onBack: () => void;
  onHome: () => void;
  onNavigateToRecommendations?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  firstCompany,
  secondCompany,
  track,
  onBack,
  onHome,
  onNavigateToRecommendations,
}) => {
  // Available companies & selection
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-optivaone');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportingPeriod>('Monthly');

  // Main Analytics State
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [activeCompany, setActiveCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved Reports State
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [reportToDelete, setReportToDelete] = useState<SavedReport | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // View Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeModalReport, setActiveModalReport] = useState<{
    company: CompanyProfile;
    analytics: PerformanceAnalytics;
  } | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);

  // Initial load of companies and saved reports
  useEffect(() => {
    async function init() {
      try {
        const comps = await fetchCompanies();
        setCompanies(comps);

        // If a company from the main workflow exists, prefer it
        if (firstCompany?.companyName) {
          const match = comps.find(
            (c) => c.name.toLowerCase() === firstCompany.companyName.toLowerCase()
          );
          if (match) {
            setSelectedCompanyId(match.id);
          } else {
            // First company is custom, use its name
            setSelectedCompanyId(firstCompany.companyName);
          }
        }
      } catch (err) {
        console.warn('Could not load company roster:', err);
      }

      loadSavedReports();
    }
    init();
  }, [firstCompany]);

  const loadSavedReports = async () => {
    try {
      const reports = await fetchSavedReports();
      setSavedReports(reports);
    } catch (err) {
      console.warn('Failed to load saved reports:', err);
    }
  };

  // Fetch Analytics data for selected company & period
  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchAnalyticsData(
        selectedCompanyId,
        selectedPeriod,
        firstCompany?.track || track
      );
      setAnalytics(result.analytics);
      setActiveCompany(result.company);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setErrorMessage(err.message || 'Failed to retrieve analytics data from server.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompanyId, selectedPeriod, firstCompany, track]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Trigger live sync
  const handleLiveSync = async () => {
    if (!activeCompany) return;
    setIsSyncing(true);
    setErrorMessage(null);

    try {
      const refreshed = await triggerLiveAnalyticsCollect(activeCompany.id, selectedPeriod);
      setAnalytics(refreshed);
      setSaveSuccessNotice('Live data synchronized successfully.');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Live sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save current report
  const handleSaveCurrentReport = async () => {
    if (!analytics || !activeCompany) return;
    setIsSaving(true);

    try {
      const saved = await saveReport(analytics, activeCompany);
      setSavedReports((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
      setSaveSuccessNotice(`Report for ${activeCompany.name} (${analytics.period}) saved securely!`);
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save report.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete saved report with confirmation
  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);

    try {
      await deleteSavedReport(reportToDelete.id);
      setSavedReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      setReportToDelete(null);
      setSaveSuccessNotice('Report removed successfully.');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete report.');
    } finally {
      setIsDeleting(false);
    }
  };

  // View modal for live report
  const handleOpenCurrentReportModal = () => {
    if (!analytics || !activeCompany) return;
    setActiveModalReport({
      company: activeCompany,
      analytics,
    });
    setIsReportModalOpen(true);
  };

  // View modal for saved report
  const handleOpenSavedReportModal = (saved: SavedReport) => {
    const comp: CompanyProfile = {
      id: saved.companyId,
      name: saved.companyName,
      track: saved.track,
      socialLinks: {},
      createdAt: saved.createdAt,
      updatedAt: saved.createdAt,
    };
    setActiveModalReport({
      company: comp,
      analytics: saved.reportData,
    });
    setIsReportModalOpen(true);
  };

  // Download PDF for current report
  const handleDownloadPDF = async () => {
    const reportData = activeModalReport?.analytics || analytics;
    const comp = activeModalReport?.company || activeCompany;
    if (!reportData || !comp) return;

    setIsDownloadingPDF(true);
    try {
      await generateAndDownloadReportPDF('report-main-content-view', comp, reportData);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const periodOptions: ReportingPeriod[] = ['Today', 'Last Week', 'Monthly', 'Annual'];

  return (
    <div className="w-full space-y-7 animate-in fade-in duration-200 text-slate-200 pb-16">
      {/* Top action navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
        </div>

        {/* Right metadata pill */}
        <div className="flex items-center rounded-2xl border border-white/10 bg-[#12142d]/80 backdrop-blur-md px-4 py-2 divide-x divide-white/10 text-xs shadow-lg">
          <div className="pr-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                REPORT ENGINE
              </div>
              <div className="font-semibold text-white">Full Analytics</div>
            </div>
          </div>
          <div className="px-3">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              WINDOW
            </div>
            <div className="font-semibold text-purple-300">{selectedPeriod}</div>
          </div>
          <div className="pl-3">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              STATUS
            </div>
            <div className="font-mono font-semibold text-emerald-400">
              {analytics?.status === 'live'
                ? 'Live Telemetry'
                : analytics?.status === 'stored'
                ? 'Indexed DB'
                : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.22em] text-purple-400 font-semibold mb-2 flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-purple-400" />
            <span>04 · PERFORMANCE ANALYTICS DOSSIER</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Company{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Performance Report
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Verified, production-grade social performance indexes, publishing cadence, and engagement proportions derived from authentic multi-channel data.
          </p>
        </div>

        {/* Global Report Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleLiveSync}
            disabled={isSyncing || isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCurrentReportModal}
            disabled={isLoading || !analytics}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-900/40 transition cursor-pointer disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>View Report</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isLoading || isDownloadingPDF || !analytics}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-900/40 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveCurrentReport}
            disabled={isLoading || isSaving || !analytics}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotice(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          1. COMPANY OVERVIEW SECTION & REPORTING PERIOD SELECTOR
          ======================================================== */}
      <div className="glass-card rounded-2xl border border-white/10 bg-[#0d0e22]/90 shadow-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-white/10">
          {/* Company Details Roster */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activeCompany?.name || 'OptivaOne'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">
                {activeCompany?.track || 'Retail & Footwear'}
              </span>

              {/* Data Origin Verification Badge */}
              {analytics && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                    analytics.status === 'live'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : analytics.status === 'stored'
                      ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      analytics.status === 'live'
                        ? 'bg-emerald-400 animate-ping'
                        : analytics.status === 'stored'
                        ? 'bg-blue-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {analytics.status === 'live'
                      ? 'Live API Telemetry'
                      : analytics.status === 'stored'
                      ? 'Database Archive'
                      : 'Data Unavailable'}
                  </span>
                </div>
              )}
            </div>

            {/* Social Links & Official Online Handles */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {/* Instagram */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Instagram:</span>
                {activeCompany?.socialLinks?.instagram ? (
                  <a
                    href={activeCompany.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono hover:underline"
                  >
                    <span>@{activeCompany.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Data unavailable</span>
                )}
              </div>

              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">
                ·
              </span>

              {/* Facebook */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Facebook:</span>
                {activeCompany?.socialLinks?.facebook ? (
                  <a
                    href={activeCompany.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono hover:underline"
                  >
                    <span>/company/{activeCompany.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Data unavailable</span>
                )}
              </div>

              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">
                ·
              </span>

              {/* Official Website */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Official Website:</span>
                {activeCompany?.socialLinks?.website ? (
                  <a
                    href={activeCompany.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono hover:underline"
                  >
                    <Globe className="w-3 h-3" />
                    <span>{activeCompany.socialLinks.website.replace('https://', '')}</span>
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Data unavailable</span>
                )}
              </div>

              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">
                ·
              </span>

              {/* LinkedIn */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">LinkedIn:</span>
                {activeCompany?.socialLinks?.linkedin ? (
                  <a
                    href={activeCompany.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono hover:underline"
                  >
                    <span>linkedin.com/company</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Data unavailable</span>
                )}
              </div>
            </div>
          </div>

          {/* Company Switcher dropdown (if multiple companies available) */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="text-xs text-slate-400 font-medium">Target Entity:</span>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#12142d] text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.track})
                </option>
              ))}
              {firstCompany && !companies.some((c) => c.name === firstCompany.companyName) && (
                <option value={firstCompany.companyName}>
                  {firstCompany.companyName} (Active Workflow)
                </option>
              )}
              {secondCompany && !companies.some((c) => c.name === secondCompany.companyName) && (
                <option value={secondCompany.companyName}>
                  {secondCompany.companyName} (Rival Benchmark)
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Reporting Period Selector (Today, Last Week, Monthly, Annual) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Reporting Horizon Selection</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregated across all verified channels for the selected sampling window.
            </p>
          </div>

          {/* Segmented Button Selector (zero-pill discipline) */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-xl shrink-0 self-start sm:self-auto">
            {periodOptions.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          LOADING, ERROR, AND EMPTY STATES
          ======================================================== */}
      {isLoading ? (
        <div className="p-16 text-center space-y-4 glass-card rounded-2xl border border-white/10 bg-[#0d0e22]/90">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Aggregating Performance Analytics...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scanning social indexes, posting cadence curves, and engagement breakdown metrics for {selectedPeriod} horizon.
            </p>
          </div>
        </div>
      ) : errorMessage ? (
        /* Error State with Retry Button */
        <div className="p-10 text-center space-y-4 glass-card rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Analytics Telemetry Error</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={loadAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Retrieval</span>
          </button>
        </div>
      ) : analytics?.status === 'unavailable' || !analytics ? (
        /* Empty Data State */
        <div className="p-14 text-center space-y-4 glass-card rounded-2xl border border-white/10 bg-[#0d0e22]/90">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Sufficient Data Available</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No sufficient data is available for this reporting period ({selectedPeriod}) for {activeCompany?.name}.
              We do not fabricate synthetic numbers when live sensors have not gathered enough signals.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedPeriod('Monthly')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              Switch to Monthly Window
            </button>
            <button
              type="button"
              onClick={handleLiveSync}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-medium transition cursor-pointer"
            >
              Request Live Ingest
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
            2. PERFORMANCE ANALYTICS VISUALIZATIONS & METRICS
            ======================================================== */
        <div id="report-main-content-view" className="space-y-7">
          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Total Posts */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>TOTAL POSTS</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {analytics.totalPosts !== null ? analytics.totalPosts : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
              </div>
              <div className="text-[10px] text-slate-500">Published in {selectedPeriod}</div>
            </div>

            {/* Average Engagement */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>AVG ENGAGEMENT</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {analytics.averageEngagement !== null ? (
                  analytics.averageEngagement.toLocaleString()
                ) : (
                  <span className="text-xs text-slate-500 font-sans">Data unavailable</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Per release actions</div>
            </div>

            {/* Engagement Rate */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>ENGAGEMENT RATE</span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {analytics.engagementRate !== null ? (
                  `${analytics.engagementRate}%`
                ) : (
                  <span className="text-xs text-slate-500 font-sans">Data unavailable</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Benchmark: 3.2%</div>
            </div>

            {/* Posting Frequency */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>FREQUENCY</span>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-sm font-bold font-mono text-purple-300 mt-1">
                {analytics.postingFrequency || <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
              </div>
              <div className="text-[10px] text-slate-500">Publishing pace</div>
            </div>

            {/* Growth / Lift */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>PERIOD LIFT</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300">
                {analytics.engagementGrowth !== null ? (
                  `+${analytics.engagementGrowth}%`
                ) : (
                  <span className="text-xs text-slate-500 font-sans">Data unavailable</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Interactions trajectory</div>
            </div>

            {/* Audience Total */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1 bg-[#0d0e24]/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <span>TOTAL AUDIENCE</span>
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-200">
                {analytics.audienceTotal !== null ? (
                  analytics.audienceTotal.toLocaleString()
                ) : (
                  <span className="text-xs text-slate-500 font-sans">Data unavailable</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Followers & visitors</div>
            </div>
          </div>

          {/* Interactive Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Posting Frequency Bar Chart */}
            <PostingFrequencyBarChart
              data={analytics.postingFrequencyData}
              period={selectedPeriod}
            />

            {/* Chart 2: Engagement Trends Line Chart */}
            <EngagementTrendsLineChart
              data={analytics.engagementTrendsData}
              period={selectedPeriod}
            />
          </div>

          {/* Chart 3: Engagement Breakdown Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EngagementBreakdownDonutChart
                data={analytics.engagementBreakdown}
                period={selectedPeriod}
              />
            </div>

            {/* Best & Lowest Performing Posts Highlights */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0d0f24]/90 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Post Performance Extremes</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Audited</span>
                </div>

                {/* Best post */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-400 uppercase font-mono tracking-wider">
                      Best-Performing Post
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                      {analytics.bestPost?.platform || 'Instagram'}
                    </span>
                  </div>
                  {analytics.bestPost ? (
                    <>
                      <div className="text-xs font-bold text-white line-clamp-2">
                        {analytics.bestPost.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>{analytics.bestPost.date}</span>
                        <span className="text-emerald-400 font-semibold">{analytics.bestPost.metricValue}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Data unavailable</p>
                  )}
                </div>

                {/* Lowest post */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-400 uppercase font-mono tracking-wider">
                      Lowest-Performing Post
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {analytics.lowestPost?.platform || 'LinkedIn'}
                    </span>
                  </div>
                  {analytics.lowestPost ? (
                    <>
                      <div className="text-xs font-bold text-slate-300 line-clamp-2">
                        {analytics.lowestPost.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>{analytics.lowestPost.date}</span>
                        <span className="text-amber-400 font-semibold">{analytics.lowestPost.metricValue}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Data unavailable</p>
                  )}
                </div>
              </div>

              {/* Data verification strip */}
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Source: {analytics.dataSourceInfo.split('(')[0]}</span>
                <span className="text-purple-300 font-mono">100% Real API Ingest</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. SAVED REPORTS ARCHIVE & DATABASE STORE
          ======================================================== */}
      <div className="glass-card rounded-2xl border border-white/10 bg-[#0d0e22]/90 shadow-xl overflow-hidden mt-8">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Saved Reports Archive</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold">
                  {savedReports.length} {savedReports.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Persistent database records associated with authenticated user (denishraja011@gmail.com).
              </p>
            </div>
          </div>
        </div>

        {/* Saved Reports List */}
        <div className="divide-y divide-white/5">
          {savedReports.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <Bookmark className="w-7 h-7 mx-auto text-slate-500" />
              <p className="text-sm font-semibold text-white">No saved reports yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate performance analytics above and click "Save Report" to store a permanent snapshot in the database.
              </p>
            </div>
          ) : (
            savedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{report.companyName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-purple-300">
                      {report.reportingPeriod}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{report.version}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Generated: {report.generatedAt}</span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span>Track: {report.track}</span>
                  </div>
                </div>

                {/* Saved Report Action Buttons: View, Download PDF, Delete */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenSavedReportModal(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const comp: CompanyProfile = {
                        id: report.companyId,
                        name: report.companyName,
                        track: report.track,
                        socialLinks: {},
                        createdAt: report.createdAt,
                        updatedAt: report.createdAt,
                      };
                      generateAndDownloadReportPDF(
                        'report-main-content-view',
                        comp,
                        report.reportData,
                        report.generatedAt
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportToDelete(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-300 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================
          7. DELETE CONFIRMATION DIALOG (Requirement 7)
          ======================================================== */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#12142d] border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="text-base font-bold text-white">Delete Report Confirmation</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this report?
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
              <div className="font-semibold text-white">
                {reportToDelete.companyName} — {reportToDelete.reportingPeriod}
              </div>
              <div className="text-slate-400 text-[11px]">
                Created on {reportToDelete.generatedAt}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW REPORT FULL MODAL (Requirement 5)
          ======================================================== */}
      {isReportModalOpen && activeModalReport && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          company={activeModalReport.company}
          analytics={activeModalReport.analytics}
          onDownloadPDF={handleDownloadPDF}
          isDownloading={isDownloadingPDF}
        />
      )}
    </div>
  );
};
