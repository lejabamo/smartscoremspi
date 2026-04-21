// Answer values
export type AnswerValue = 1 | 0.5 | 0;

export const ANSWER_VALUES = {
  IMPLEMENTED: 1 as const,
  PARTIAL: 0.5 as const,
  NOT_IMPLEMENTED: 0 as const,
} as const;

// Answer labels
export const ANSWER_LABELS = {
  [ANSWER_VALUES.IMPLEMENTED]: 'Implemented',
  [ANSWER_VALUES.PARTIAL]: 'Partial',
  [ANSWER_VALUES.NOT_IMPLEMENTED]: 'Not Implemented',
} as const;

// Domains
export type Domain = 'Governance' | 'Risk Management' | 'Operational Controls' | 'Compliance & Evidence';

export const DOMAINS: Domain[] = [
  'Governance',
  'Risk Management',
  'Operational Controls',
  'Compliance & Evidence',
] as const;

// Domain weights
export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  'Governance': 0.30,
  'Risk Management': 0.30,
  'Operational Controls': 0.25,
  'Compliance & Evidence': 0.15,
} as const;

// Maturity levels
export type MaturityLevel = 'Inicial' | 'Básico' | 'Gestionado' | 'Optimizado';

// Question interface
export interface Question {
  id: number;
  domain: Domain;
  text: string;
  weight: number;
  refMSPI?: string;
  refISO?: string;
}

// Answer interface
export interface Answer {
  questionId: number;
  value: AnswerValue;
}

// Assessment data interface
export interface AssessmentData {
  answers: Answer[];
  completedAt?: Date;
}

// Domain score interface
export interface DomainScore {
  domain: Domain;
  score: number; // Raw score (sum of answer values * question weights)
  maxScore: number; // Maximum possible score for this domain
  percentage: number; // Score as percentage (0-100)
  weightedScore: number; // Score * domain weight
}

// Scoring result interface
export interface ScoringResult {
  totalScore: number; // Weighted total score (0-100)
  domainScores: DomainScore[];
  maturityLevel: MaturityLevel;
  gaps: number[]; // Array of question IDs with not_implemented answers
}

// Assessment result interface (legacy, for backward compatibility)
export interface AssessmentResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  gaps: string[];
  recommendations: string[];
  domainScores?: {
    domain: Domain;
    score: number;
    percentage: number;
  }[];
}
