import {
  CompanyDetails,
  CompetitorCompany,
  IntelligenceResult,
  LocationOption,
  TimePeriod,
  TrackOption,
  ComparisonReport,
  ComparisonMetricRow,
} from '../types';

export function generateIntelligenceData(
  company: CompanyDetails,
  location: LocationOption,
  locationName: string,
  track: TrackOption | string,
  timePeriod: TimePeriod
): IntelligenceResult {
  const periodMultiplier: Record<TimePeriod, { multiplier: number; label: string; growth: string }> = {
    Today: { multiplier: 1, label: 'Past 24 Hours', growth: '+2.4%' },
    'Last Week': { multiplier: 7.2, label: 'Past 7 Days', growth: '+5.8%' },
    Monthly: { multiplier: 31.5, label: 'Last 30 Days', growth: '+14.2%' },
    Annual: { multiplier: 368, label: 'Past 12 Months', growth: '+38.6%' },
  };

  const pm = periodMultiplier[timePeriod] || periodMultiplier.Monthly;
  const hashSeed = (company.companyName + track + location).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const baseAudience = 85000 + (hashSeed % 45000);
  const totalAudienceNum = Math.round(baseAudience * (1 + (hashSeed % 10) * 0.05));
  const baseWeb = Math.round((totalAudienceNum * 0.42 * pm.multiplier) / 10);
  const engagementNum = (3.4 + ((hashSeed % 25) / 10)).toFixed(1);
  const sentimentNum = 88 + (hashSeed % 9);
  const voiceNum = 24 + (hashSeed % 15);

  const formatNum = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const platformBreakdown = [
    {
      platform: 'Instagram' as const,
      followersOrVisitors: formatNum(Math.round(totalAudienceNum * 0.48)),
      engagementRate: `${(Number(engagementNum) * 1.25).toFixed(1)}%`,
      growth: pm.growth,
      postsOrUpdates: timePeriod === 'Today' ? '2 Stories, 1 Reel' : `${Math.round(4 * (pm.multiplier / 4))} posts`,
      topMetricLabel: 'Reel Interactions',
      topMetricValue: formatNum(Math.round(totalAudienceNum * 0.06 * (pm.multiplier / 2))),
    },
    {
      platform: 'Facebook' as const,
      followersOrVisitors: formatNum(Math.round(totalAudienceNum * 0.28)),
      engagementRate: `${(Number(engagementNum) * 0.72).toFixed(1)}%`,
      growth: '+1.9%',
      postsOrUpdates: timePeriod === 'Today' ? '1 Update' : `${Math.round(2.5 * (pm.multiplier / 4))} posts`,
      topMetricLabel: 'Community Reach',
      topMetricValue: formatNum(Math.round(totalAudienceNum * 0.32)),
    },
    {
      platform: 'Website' as const,
      followersOrVisitors: formatNum(baseWeb),
      engagementRate: '2m 45s avg',
      growth: '+8.3%',
      postsOrUpdates: '4 Landing Pages',
      topMetricLabel: 'Conversion Goal',
      topMetricValue: '4.2%',
    },
    {
      platform: 'LinkedIn' as const,
      followersOrVisitors: formatNum(Math.round(totalAudienceNum * 0.24)),
      engagementRate: `${(Number(engagementNum) * 0.95).toFixed(1)}%`,
      growth: '+4.1%',
      postsOrUpdates: timePeriod === 'Today' ? '1 Insight Post' : `${Math.round(1.8 * (pm.multiplier / 4))} articles`,
      topMetricLabel: 'B2B Inquiries',
      topMetricValue: timePeriod === 'Today' ? '6 leads' : `${Math.round(12 * (pm.multiplier / 4))} leads`,
    },
  ];

  return {
    company,
    location,
    locationName: locationName || `${location} Scope`,
    track,
    timePeriod,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    summary: {
      totalAudience: formatNum(totalAudienceNum),
      avgEngagement: `${engagementNum}%`,
      webVisits: formatNum(baseWeb),
      sentimentScore: `${sentimentNum}% Positive`,
      shareOfVoice: `${voiceNum}% in ${track}`,
    },
    platformBreakdown,
    highlights: {
      strengths: [
        `Strong Instagram visual presence with ${platformBreakdown[0].engagementRate} engagement in ${location}`,
        `Healthy conversion on official website (${platformBreakdown[2].followersOrVisitors} visits) during ${timePeriod}`,
        `High executive traction on LinkedIn exceeding category averages for ${track}`,
      ],
      opportunities: [
        `Expand video content cadence on Facebook to tap into regional demographics`,
        `Improve web bounce rate by localizing landing page copy for ${location}`,
      ],
    },
  };
}

export function generateComparisonReport(
  ourCompany: CompanyDetails,
  competitors: CompetitorCompany[],
  location: LocationOption,
  track: TrackOption | string,
  timePeriod: TimePeriod
): ComparisonReport {
  const allCompanies = [
    { id: 'our', name: ourCompany.companyName, isOur: true },
    ...competitors.map((c) => ({ id: c.id, name: c.companyName, isOur: false })),
  ];

  const rows: ComparisonMetricRow[] = [
    {
      metric: 'Share of Voice (Category)',
      category: 'Overview',
      ourValue: '31.4%',
      competitors: competitors.reduce((acc, c, idx) => {
        const val = 28 - idx * 4 + (c.companyName.length % 5);
        acc[c.id] = `${val.toFixed(1)}%`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: 'our',
    },
    {
      metric: 'Combined Social Followers',
      category: 'Social',
      ourValue: '184.2K',
      competitors: competitors.reduce((acc, c, idx) => {
        const val = 140 + (idx * 25) + ((c.companyName.charCodeAt(0) % 20));
        acc[c.id] = `${val}K`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: competitors.length > 0 ? competitors[0].id : 'our',
    },
    {
      metric: 'Avg Engagement Rate',
      category: 'Engagement',
      ourValue: '4.6%',
      competitors: competitors.reduce((acc, c, idx) => {
        const val = (3.2 + (idx * 0.4)).toFixed(1);
        acc[c.id] = `${val}%`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: 'our',
    },
    {
      metric: 'Estimated Web Traffic',
      category: 'Traffic',
      ourValue: timePeriod === 'Today' ? '18.4K' : timePeriod === 'Last Week' ? '92.5K' : '384.0K',
      competitors: competitors.reduce((acc, c, idx) => {
        const base = timePeriod === 'Today' ? 14 : timePeriod === 'Last Week' ? 76 : 310;
        acc[c.id] = `${base + idx * 12}K`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: 'our',
    },
    {
      metric: 'Audience Sentiment Score',
      category: 'Overview',
      ourValue: '91%',
      competitors: competitors.reduce((acc, c, idx) => {
        const score = 84 + (idx * 3);
        acc[c.id] = `${score}%`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: 'our',
    },
    {
      metric: 'Weekly Content Velocity',
      category: 'Social',
      ourValue: '14 posts / wk',
      competitors: competitors.reduce((acc, c, idx) => {
        const posts = 11 + idx * 3;
        acc[c.id] = `${posts} posts / wk`;
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: competitors.length > 1 ? competitors[1].id : 'our',
    },
    {
      metric: 'B2B LinkedIn Authority',
      category: 'Social',
      ourValue: 'Top 15%',
      competitors: competitors.reduce((acc, c, idx) => {
        acc[c.id] = idx === 0 ? 'Top 18%' : 'Top 25%';
        return acc;
      }, {} as Record<string, string>),
      winnerCompanyId: 'our',
    },
  ];

  const channelScores = [
    {
      platform: 'Instagram' as const,
      ourScore: 88,
      competitorScores: competitors.reduce((acc, c, idx) => {
        acc[c.id] = 76 + ((idx * 6) % 18);
        return acc;
      }, {} as Record<string, number>),
    },
    {
      platform: 'Facebook' as const,
      ourScore: 72,
      competitorScores: competitors.reduce((acc, c, idx) => {
        acc[c.id] = 78 - idx * 5;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      platform: 'Website' as const,
      ourScore: 92,
      competitorScores: competitors.reduce((acc, c, idx) => {
        acc[c.id] = 81 + idx * 4;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      platform: 'LinkedIn' as const,
      ourScore: 84,
      competitorScores: competitors.reduce((acc, c, idx) => {
        acc[c.id] = 70 + idx * 5;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  const competitorNames = competitors.map((c) => c.companyName).join(', ');

  const competitiveTakeaways = [
    `${ourCompany.companyName} leads in Organic Engagement Rate (${rows[2].ourValue}) compared to peer competitors.`,
    `Official Website performance and dwell time index higher than ${competitorNames || 'industry peers'}.`,
    `Opportunity to scale Instagram Reels and TikTok velocity to bridge raw follower differentials.`,
  ];

  return {
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timePeriod,
    track: String(track),
    location: String(location),
    rows,
    channelScores,
    competitiveTakeaways,
  };
}
