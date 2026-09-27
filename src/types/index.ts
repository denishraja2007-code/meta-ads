export type LocationOption = 'Country' | 'State' | 'District' | 'Region';

export type TrackOption = 'Textile' | 'Shoes' | 'Business' | 'Hotel' | 'Others';

export type TimePeriod = 'Today' | 'Last Week' | 'Monthly' | 'Annual';

export interface CompanyDetails {
  companyName: string;
  track: TrackOption | string;
  instagramUrl: string;
  facebookUrl: string;
  websiteUrl: string;
  linkedinUrl: string;
}

export interface CompetitorCompany extends CompanyDetails {
  id: string;
  addedAt: string;
}

export interface PlatformMetric {
  platform: 'Instagram' | 'Facebook' | 'Website' | 'LinkedIn';
  followersOrVisitors: string;
  engagementRate: string;
  growth: string;
  postsOrUpdates: string;
  topMetricLabel: string;
  topMetricValue: string;
}

export interface IntelligenceResult {
  company: CompanyDetails;
  location: LocationOption;
  locationName: string;
  track: TrackOption | string;
  timePeriod: TimePeriod;
  generatedAt: string;
  summary: {
    totalAudience: string;
    avgEngagement: string;
    webVisits: string;
    sentimentScore: string;
    shareOfVoice: string;
  };
  platformBreakdown: PlatformMetric[];
  highlights: {
    strengths: string[];
    opportunities: string[];
  };
}

export interface ComparisonMetricRow {
  metric: string;
  category: 'Overview' | 'Social' | 'Traffic' | 'Engagement';
  ourValue: string;
  competitors: Record<string, string>; // competitorId -> value
  unit?: string;
  winnerCompanyId: string | 'our';
}

export interface ComparisonReport {
  generatedAt: string;
  timePeriod: TimePeriod;
  track: string;
  location: string;
  rows: ComparisonMetricRow[];
  channelScores: {
    platform: 'Instagram' | 'Facebook' | 'Website' | 'LinkedIn';
    ourScore: number;
    competitorScores: Record<string, number>;
  }[];
  competitiveTakeaways: string[];
}
