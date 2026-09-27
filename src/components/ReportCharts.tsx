import React, { useState } from 'react';
import {
  PostingFrequencyPoint,
  EngagementTrendPoint,
  EngagementBreakdownMetric,
} from '../types/report';
import { Calendar, TrendingUp, PieChart as PieIcon, Info } from 'lucide-react';

// ==========================================
// 1. POSTING FREQUENCY BAR CHART
// ==========================================
interface PostingFrequencyBarChartProps {
  data: PostingFrequencyPoint[];
  period: string;
}

export const PostingFrequencyBarChart: React.FC<PostingFrequencyBarChartProps> = ({ data, period }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
        <Info className="w-5 h-5 mx-auto mb-2 text-slate-400" />
        <p className="text-xs">No sufficient posting frequency data available for {period}.</p>
      </div>
    );
  }

  const maxPosts = Math.max(...data.map((d) => d.posts), 1);
  const chartHeight = 180;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0d0f24]/90 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Posting Frequency Analysis</span>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {period}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Peak: <span className="text-white font-bold">{maxPosts}</span> posts
        </div>
      </div>

      {/* SVG / Flex Bar Chart */}
      <div className="relative pt-6">
        {/* Tooltip Float */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute top-0 transform -translate-x-1/2 px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-white text-[11px] font-mono shadow-xl pointer-events-none transition-all z-20"
            style={{
              left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
            }}
          >
            <div className="font-semibold text-purple-300">{data[hoveredIndex].label}</div>
            <div className="text-white font-bold">{data[hoveredIndex].posts} posts published</div>
            <div className="text-[10px] text-slate-400">{data[hoveredIndex].date}</div>
          </div>
        )}

        <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-white/10 pb-2 relative">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
            <div className="border-b border-dashed border-slate-400 w-full" />
            <div className="border-b border-dashed border-slate-400 w-full" />
            <div className="border-b border-dashed border-slate-400 w-full" />
          </div>

          {data.map((item, idx) => {
            const heightPercent = Math.max((item.posts / maxPosts) * 100, 6);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group z-10 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-full max-w-[42px] rounded-t-lg transition-all duration-200 relative ${
                    isHovered
                      ? 'bg-gradient-to-t from-purple-500 to-indigo-400 shadow-lg shadow-purple-500/40'
                      : 'bg-purple-600/80 hover:bg-purple-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <span className="sr-only">
                    {item.label}: {item.posts} posts
                  </span>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-mono mt-2 transition-colors truncate max-w-full text-center ${
                    isHovered ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>X-Axis: Timeframe Sequence</span>
        <span>Y-Axis: Total Posts In Period</span>
      </div>
    </div>
  );
};

// ==========================================
// 2. ENGAGEMENT TRENDS LINE CHART
// ==========================================
interface EngagementTrendsLineChartProps {
  data: EngagementTrendPoint[];
  period: string;
}

export const EngagementTrendsLineChart: React.FC<EngagementTrendsLineChartProps> = ({ data, period }) => {
  const [activeMetric, setActiveMetric] = useState<
    'overallEngagement' | 'likes' | 'comments' | 'shares' | 'saves'
  >('overallEngagement');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
        <Info className="w-5 h-5 mx-auto mb-2 text-slate-400" />
        <p className="text-xs">No sufficient engagement trend data available for {period}.</p>
      </div>
    );
  }

  // Check if active metric exists in dataset
  const hasMetricData = data.some((d) => d[activeMetric] !== null && d[activeMetric] !== undefined);
  if (!hasMetricData && activeMetric !== 'overallEngagement') {
    // Fallback to overall
    setActiveMetric('overallEngagement');
  }

  const values = data.map((d) => (d[activeMetric] !== null ? Number(d[activeMetric]) : 0));
  const maxVal = Math.max(...values, 10);
  const minVal = Math.min(...values);

  const metricLabels: Record<string, { label: string; color: string }> = {
    overallEngagement: { label: 'Overall Engagement', color: '#a855f7' }, // purple
    likes: { label: 'Likes', color: '#ec4899' }, // pink
    comments: { label: 'Comments', color: '#6366f1' }, // indigo
    shares: { label: 'Shares', color: '#38bdf8' }, // sky
    saves: { label: 'Saves', color: '#34d399' }, // emerald
  };

  // SVG Coordinates
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = data.map((d, i) => {
    const val = d[activeMetric] !== null ? Number(d[activeMetric]) : 0;
    const x = paddingX + (i / (data.length - 1 || 1)) * (width - paddingX * 2);
    const y = height - paddingY - (val / (maxVal || 1)) * (height - paddingY * 2);
    return { x, y, val, label: d.label, date: d.date, rawPoint: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill gradient path
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0d0f24]/90 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span>Engagement Trends Timeline</span>
        </div>

        {/* Metric Switcher Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
          {(['overallEngagement', 'likes', 'comments', 'shares', 'saves'] as const).map((mKey) => {
            const isAvail = data.some((d) => d[mKey] !== null);
            if (!isAvail) return null; // Only show metrics with data
            const isActive = activeMetric === mKey;

            return (
              <button
                key={mKey}
                type="button"
                onClick={() => setActiveMetric(mKey)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {metricLabels[mKey].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricLabels[activeMetric].color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={metricLabels[activeMetric].color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.15)"
          />

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#trendGradient)" />}

          {/* Main Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={metricLabels[activeMetric].color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Point Dots */}
          {points.map((p, i) => {
            const isHovered = hoveredPoint === i;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#ffffff' : metricLabels[activeMetric].color}
                  stroke="#0a0c20"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* X-axis tick labels */}
                <text
                  x={p.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint !== null && points[hoveredPoint] && (
          <div
            className="absolute px-3 py-1.5 rounded-xl bg-[#12142d] border border-white/20 text-white text-xs shadow-2xl pointer-events-none z-20 space-y-0.5"
            style={{
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              top: `${(points[hoveredPoint].y / height) * 100 - 38}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="font-semibold text-purple-300 text-[11px]">{points[hoveredPoint].label} ({points[hoveredPoint].date})</div>
            <div className="font-mono font-bold text-sm text-white">
              {metricLabels[activeMetric].label}: {points[hoveredPoint].val.toLocaleString()}
            </div>
            {/* Show other metrics if available */}
            <div className="text-[10px] text-slate-400 font-mono flex gap-2 pt-0.5">
              <span>Likes: {points[hoveredPoint].rawPoint.likes}</span>
              <span>Comments: {points[hoveredPoint].rawPoint.comments}</span>
              {points[hoveredPoint].rawPoint.shares !== null && (
                <span>Shares: {points[hoveredPoint].rawPoint.shares}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>X-Axis: Timeline Trajectory</span>
        <span className="font-mono text-purple-400 font-medium">
          Peak: {maxVal.toLocaleString()} · Low: {minVal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 3. ENGAGEMENT BREAKDOWN DONUT / PIE CHART
// ==========================================
interface EngagementBreakdownDonutChartProps {
  data: EngagementBreakdownMetric[];
  period: string;
}

export const EngagementBreakdownDonutChart: React.FC<EngagementBreakdownDonutChartProps> = ({ data, period }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
        <Info className="w-5 h-5 mx-auto mb-2 text-slate-400" />
        <p className="text-xs">No engagement breakdown metrics available for {period}.</p>
      </div>
    );
  }

  const totalInteractions = data.reduce((acc, m) => acc + m.count, 0);

  // Calculate SVG donut stroke-dasharray
  // Circumference of radius 50 is 2 * PI * 50 = 314.159
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0d0f24]/90 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <PieIcon className="w-4 h-4 text-purple-400" />
          <span>Engagement Channel Breakdown</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Total: <strong className="text-white">{totalInteractions.toLocaleString()}</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 transform">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="18"
            />

            {data.map((item) => {
              const dashLength = (item.percentage / 100) * circumference;
              const strokeOffset = accumulatedOffset;
              accumulatedOffset -= dashLength;
              const isHovered = hoveredMetric === item.metric;

              return (
                <circle
                  key={item.metric}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? 22 : 18}
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredMetric(item.metric)}
                  onMouseLeave={() => setHoveredMetric(null)}
                />
              );
            })}
          </svg>

          {/* Centered KPI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredMetric ? (
              (() => {
                const metricObj = data.find((d) => d.metric === hoveredMetric);
                return (
                  <>
                    <span className="text-lg font-bold font-mono text-white">
                      {metricObj ? `${metricObj.percentage}%` : ''}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300">
                      {hoveredMetric}
                    </span>
                  </>
                );
              })()
            ) : (
              <>
                <span className="text-base font-bold font-mono text-white">100%</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Interactions
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {data.map((item) => {
            const isHovered = hoveredMetric === item.metric;
            return (
              <div
                key={item.metric}
                onMouseEnter={() => setHoveredMetric(item.metric)}
                onMouseLeave={() => setHoveredMetric(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isHovered
                    ? 'border-white/30 bg-white/[0.08]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">{item.metric}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.count.toLocaleString()} actions
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-white">{item.percentage}%</div>
                  <div className="text-[10px] text-slate-500 font-mono">Share</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
