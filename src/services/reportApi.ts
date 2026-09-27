import {
  CompanyProfile,
  PerformanceAnalytics,
  ReportingPeriod,
  SavedReport,
} from '../types/report';

const CURRENT_USER_EMAIL = 'denishraja011@gmail.com';

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-email': CURRENT_USER_EMAIL,
  };
}

export async function fetchCompanies(): Promise<CompanyProfile[]> {
  const res = await fetch('/api/companies', { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load companies.');
  const data = await res.json();
  return data.data || [];
}

export async function fetchReportingPeriods(): Promise<{ id: string; code: ReportingPeriod; label: string; description: string }[]> {
  const res = await fetch('/api/reporting-periods', { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load reporting periods.');
  const data = await res.json();
  return data.data || [];
}

export async function fetchAnalyticsData(
  companyIdOrName: string,
  period: ReportingPeriod,
  track?: string
): Promise<{ analytics: PerformanceAnalytics; company: CompanyProfile }> {
  const params = new URLSearchParams({
    company: companyIdOrName,
    period,
  });
  if (track) params.append('track', track);

  const res = await fetch(`/api/analytics?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch performance analytics data.');
  }

  const data = await res.json();
  return {
    analytics: data.data,
    company: data.company,
  };
}

export async function triggerLiveAnalyticsCollect(
  companyId: string,
  period: ReportingPeriod
): Promise<PerformanceAnalytics> {
  const res = await fetch('/api/analytics/collect', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ companyId, period }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Live data sync failed. Please retry.');
  }

  const data = await res.json();
  return data.data;
}

export async function fetchSavedReports(): Promise<SavedReport[]> {
  const res = await fetch('/api/reports/saved', { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load saved reports.');
  const data = await res.json();
  return data.data || [];
}

export async function saveReport(
  reportData: PerformanceAnalytics,
  company: CompanyProfile
): Promise<SavedReport> {
  const res = await fetch('/api/reports/saved', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ reportData, company }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save report.');
  }

  const data = await res.json();
  return data.data;
}

export async function deleteSavedReport(reportId: string): Promise<boolean> {
  const res = await fetch(`/api/reports/saved/${reportId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete report.');
  }

  return true;
}
