
export type Language = 'en' | 'ar';

export interface AuditData {
  projectName: string;
  projectType: string;
  address?: string;
  searchRanking?: string;
  establishedYear: number;
  currentReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  dailyCustomers: number;
  monthlyGrowth?: number; // Real monthly growth extracted from API
  weeklyGrowth?: number;  // Real weekly growth extracted from API
}

export type AppStage = 'language-selection' | 'data-intake' | 'scanning' | 'results' | 'visual-experience';
