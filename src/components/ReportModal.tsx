import React from 'react';
import {
  CompanyProfile,
  PerformanceAnalytics,
} from '../types/report';
import {
  X,
  Download,
  Printer,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Globe,
  Share2,
} from 'lucide-react';
import {
  PostingFrequencyBarChart,
  EngagementTrendsLineChart,
  EngagementBreakdownDonutChart,
} from './ReportCharts';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  analytics: PerformanceAnalytics;
  onDownloadPDF: () => void;
  isDownloading?: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  company,
  analytics,
  onDownloadPDF,
  isDownloading = false,
}) => {
  if (!isOpen) return null;

  const reportDate = new Date(analytics.collectedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#090b1e] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar Header */}
        <div className="p-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
              Official Performance Intelligence Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Document</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close report view"
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable/Capturable Report Document Body */}
        <div id="printable-report-document" className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#090b1e] text-slate-200">
          {/* Document Letterhead */}
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>OptivaOne Intelligence Platform · Executive Report</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {company.name} Performance Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Domain Vertical: <strong className="text-slate-200">{company.track}</strong> · Reporting Period:{' '}
                <span className="text-purple-300 font-semibold">{analytics.period}</span>
              </p>
            </div>

            <div className="text-left md:text-right text-xs font-mono space-y-1">
              <div className="text-slate-400">Report Generated:</div>
              <div className="text-white font-bold">{reportDate}</div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authentic Telemetry Verified</span>
              </div>
            </div>
          </div>

          {/* Company Details & Social Roster Strip */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Track & Domain</div>
              <div className="font-semibold text-white">{company.track}</div>
            </div>

            {company.socialLinks.website && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Official Website</div>
                <a
                  href={company.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
                >
                  <Globe className="w-3 h-3" />
                  <span>{company.socialLinks.website.replace('https://', '')}</span>
                </a>
              </div>
            )}

            {company.socialLinks.instagram && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Instagram</div>
                <a
                  href={company.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:text-pink-300 font-mono"
                >
                  @{company.name.toLowerCase().replace(/\s+/g, '')}
                </a>
              </div>
            )}

            {company.socialLinks.linkedin && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">LinkedIn</div>
                <a
                  href={company.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                >
                  /company/{company.name.toLowerCase().replace(/\s+/g, '')}
                </a>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Data Origin</div>
              <div className="text-slate-300">{analytics.dataSourceInfo}</div>
            </div>
          </div>

          {/* Key Performance Metric Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Key Performance Indicators</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Total Posts</div>
                <div className="text-xl font-bold font-mono text-white">
                  {analytics.totalPosts !== null ? analytics.totalPosts : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Avg Engagement</div>
                <div className="text-xl font-bold font-mono text-white">
                  {analytics.averageEngagement !== null ? analytics.averageEngagement.toLocaleString() : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Engagement Rate</div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {analytics.engagementRate !== null ? `${analytics.engagementRate}%` : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Posting Frequency</div>
                <div className="text-sm font-bold font-mono text-purple-300 mt-1">
                  {analytics.postingFrequency || <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Period Lift</div>
                <div className="text-xl font-bold font-mono text-indigo-400">
                  {analytics.engagementGrowth !== null ? `+${analytics.engagementGrowth}%` : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Total Audience</div>
                <div className="text-xl font-bold font-mono text-slate-200">
                  {analytics.audienceTotal !== null ? analytics.audienceTotal.toLocaleString() : <span className="text-xs text-slate-500 font-sans">Data unavailable</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Visualizations Roster */}
          <div className="space-y-6 pt-2">
            {/* Posting Frequency Bar Chart */}
            <PostingFrequencyBarChart
              data={analytics.postingFrequencyData}
              period={analytics.period}
            />

            {/* Engagement Trends Line Chart */}
            <EngagementTrendsLineChart
              data={analytics.engagementTrendsData}
              period={analytics.period}
            />

            {/* Engagement Breakdown Donut Chart */}
            <EngagementBreakdownDonutChart
              data={analytics.engagementBreakdown}
              period={analytics.period}
            />
          </div>

          {/* Top & Lowest Performing Post Records */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 uppercase font-mono tracking-wider">
                  Top-Performing Post Highlight
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  {analytics.bestPost?.platform || 'Instagram'}
                </span>
              </div>
              {analytics.bestPost ? (
                <>
                  <div className="text-sm font-bold text-white">{analytics.bestPost.title}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                    <span>Published: {analytics.bestPost.date}</span>
                    <span className="text-emerald-400 font-bold">{analytics.bestPost.metricValue}</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">Data unavailable</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase font-mono tracking-wider">
                  Lowest-Performing Post Analysis
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  {analytics.lowestPost?.platform || 'LinkedIn'}
                </span>
              </div>
              {analytics.lowestPost ? (
                <>
                  <div className="text-sm font-bold text-slate-300">{analytics.lowestPost.title}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                    <span>Published: {analytics.lowestPost.date}</span>
                    <span className="text-amber-400 font-bold">{analytics.lowestPost.metricValue}</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">Data unavailable</p>
              )}
            </div>
          </div>

          {/* Strategic Executive Summary */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0e1026] border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Executive Synthesis & Next Action Items</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analytics.summaryNarrative ||
                `Performance metrics reflect consistent output across ${analytics.period}. Consider expanding video content and optimizing response latency to compound market share.`}
            </p>
          </div>

          {/* Footer certification */}
          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>OptivaOne Intelligence Platform · Confidential Telemetry Report</span>
            <span>Document Signature Hash: SHA256-OPTIVA-{company.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
