import { CompanyDetails } from '../types';

const STORAGE_KEY = 'competitor_intelligence_company_details';
const COMPARISON_KEY = 'competitor_intelligence_competitors_list';

export function getSavedCompanyDetails(): CompanyDetails | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.companyName === 'string') {
      return parsed as CompanyDetails;
    }
  } catch (err) {
    console.warn('Failed to read saved company details from localStorage', err);
  }
  return null;
}

export function saveCompanyDetails(details: CompanyDetails): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  } catch (err) {
    console.warn('Failed to save company details to localStorage', err);
  }
}

export function clearSavedCompanyDetails(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear saved company details', err);
  }
}

export function getSavedCompetitors(): any[] {
  try {
    const raw = localStorage.getItem(COMPARISON_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to read competitors from localStorage', err);
  }
  return [];
}

export function saveCompetitors(competitors: any[]): void {
  try {
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(competitors));
  } catch (err) {
    console.warn('Failed to save competitors to localStorage', err);
  }
}
