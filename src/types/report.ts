export type ReportingPeriod = 'Today' | 'Last Week' | 'Monthly' | 'Annual';

export interface CompanySocialLinks {
  instagram?: string;
  facebook?: string;
  website?: string;
  linkedin?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  track: string;
  socialLinks: CompanySocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface PostingFrequencyPoint {
  date: string;
  label: string;
  posts: number;
}

export interface EngagementTrendPoint {
  date: string;
  label: string;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  overallEngagement: number | null;
}

export interface EngagementBreakdownMetric {
  metric: 'Likes' | 'Comments' | 'Shares' | 'Saves';
  count: number;
  percentage: number;
  color: string;
}

export interface PostPerformanceRecord {
  title: string;
  date: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Website';
  metricLabel: string;
  metricValue: string;
  engagement: number;
  url?: string;
}

export interface PerformanceAnalytics {
  id: string;
  companyId: string;
  companyName: string;
  track: string;
  period: ReportingPeriod;
  status: 'live' | 'stored' | 'unavailable';
  collectedAt: string;
  dataSourceInfo: string;
  
  // High-level KPI metrics
  totalPosts: number | null;
  averageEngagement: number | null; // e.g. average interactions per post
  engagementRate: number | null; // percentage e.g. 4.8%
  postingFrequency: string | null; // e.g. "2.4 posts/day"
  engagementGrowth: number | null; // percentage e.g. +14.2%
  audienceTotal: number | null; // total followers/visitors
  
  // Post highlights
  bestPost: PostPerformanceRecord | null;
  lowestPost: PostPerformanceRecord | null;
  
  // Chart datasets
  postingFrequencyData: PostingFrequencyPoint[];
  engagementTrendsData: EngagementTrendPoint[];
  engagementBreakdown: EngagementBreakdownMetric[];
  
  // Executive summary
  summaryNarrative?: string;
}

export interface SavedReport {
  id: string;
  userId: string;
  userEmail: string;
  companyId: string;
  companyName: string;
  track: string;
  reportingPeriod: ReportingPeriod;
  generatedAt: string;
  version: string;
  reportData: PerformanceAnalytics;
  createdAt: string;
}
