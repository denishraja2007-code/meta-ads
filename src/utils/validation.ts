import { CompanyDetails } from '../types';

export interface ValidationErrors {
  companyName?: string;
  track?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

export function isValidUrl(input: string): boolean {
  if (!input || !input.trim()) return false;
  const trimmed = input.trim();
  
  // Allow inputs that start with http:// or https:// or plain domain
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  
  try {
    const url = new URL(candidate);
    return url.hostname.includes('.') && url.hostname.split('.')[0].length > 0;
  } catch {
    return false;
  }
}

export function isPlatformUrl(input: string, platformDomain: string): boolean {
  if (!isValidUrl(input)) return false;
  const trimmed = input.trim().toLowerCase();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.hostname.toLowerCase().includes(platformDomain.toLowerCase());
  } catch {
    return false;
  }
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function validateCompanyForm(details: Partial<CompanyDetails>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!details.companyName || !details.companyName.trim()) {
    errors.companyName = 'Company Name is required.';
  } else if (details.companyName.trim().length < 2) {
    errors.companyName = 'Company Name must be at least 2 characters.';
  }

  if (!details.track || !details.track.trim()) {
    errors.track = 'Track selection is required.';
  }

  // Instagram URL
  if (!details.instagramUrl || !details.instagramUrl.trim()) {
    errors.instagramUrl = 'Instagram URL is required.';
  } else if (!isValidUrl(details.instagramUrl)) {
    errors.instagramUrl = 'Please enter a valid URL (e.g., https://instagram.com/brand).';
  } else if (!isPlatformUrl(details.instagramUrl, 'instagram.com')) {
    errors.instagramUrl = 'Must be an Instagram URL (domain must include instagram.com).';
  }

  // Facebook URL
  if (!details.facebookUrl || !details.facebookUrl.trim()) {
    errors.facebookUrl = 'Facebook URL is required.';
  } else if (!isValidUrl(details.facebookUrl)) {
    errors.facebookUrl = 'Please enter a valid URL (e.g., https://facebook.com/brand).';
  } else if (!isPlatformUrl(details.facebookUrl, 'facebook.com') && !isPlatformUrl(details.facebookUrl, 'fb.com')) {
    errors.facebookUrl = 'Must be a Facebook URL (domain must include facebook.com).';
  }

  // Official Website URL
  if (!details.websiteUrl || !details.websiteUrl.trim()) {
    errors.websiteUrl = 'Official Website URL is required.';
  } else if (!isValidUrl(details.websiteUrl)) {
    errors.websiteUrl = 'Please enter a valid Website URL (e.g., https://example.com).';
  }

  // LinkedIn URL
  if (!details.linkedinUrl || !details.linkedinUrl.trim()) {
    errors.linkedinUrl = 'LinkedIn URL is required.';
  } else if (!isValidUrl(details.linkedinUrl)) {
    errors.linkedinUrl = 'Please enter a valid URL (e.g., https://linkedin.com/company/brand).';
  } else if (!isPlatformUrl(details.linkedinUrl, 'linkedin.com')) {
    errors.linkedinUrl = 'Must be a LinkedIn URL (domain must include linkedin.com).';
  }

  return errors;
}
