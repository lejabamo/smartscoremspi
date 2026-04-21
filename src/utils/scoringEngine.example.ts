/**
 * Example usage of the MSPI scoring engine
 * This file demonstrates how to use the calculateMSPIScore function
 */

import { calculateMSPIScore, validateAnswers } from './scoringEngine';
import { Answer, ANSWER_VALUES } from '../types/assessment';

// Example: Calculate score with sample answers
export function exampleUsage() {
  // Sample answers - all questions answered as "Implemented"
  const sampleAnswers: Answer[] = [
    { questionId: 1, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 2, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 3, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 4, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 5, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 6, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 7, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 8, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 9, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 10, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 11, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 12, value: ANSWER_VALUES.IMPLEMENTED },
  ];

  // Validate answers
  const isValid = validateAnswers(sampleAnswers);
  console.log('Answers valid:', isValid);

  // Calculate score
  const result = calculateMSPIScore(sampleAnswers);

  // Result structure:
  // {
  //   totalScore: 100, // Weighted total (0-100)
  //   domainScores: [
  //     {
  //       domain: 'Governance',
  //       score: 3.0, // Raw score
  //       maxScore: 3.0,
  //       percentage: 100,
  //       weightedScore: 30 // percentage * domain weight
  //     },
  //     // ... other domains
  //   ],
  //   maturityLevel: 'Optimizado',
  //   gaps: [] // Question IDs with not_implemented answers
  // }

  return result;
}

// Example: Calculate score with mixed answers
export function exampleWithGaps() {
  const mixedAnswers: Answer[] = [
    { questionId: 1, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 2, value: ANSWER_VALUES.PARTIAL },
    { questionId: 3, value: ANSWER_VALUES.NOT_IMPLEMENTED }, // Gap
    { questionId: 4, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 5, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 6, value: ANSWER_VALUES.PARTIAL },
    { questionId: 7, value: ANSWER_VALUES.NOT_IMPLEMENTED }, // Gap
    { questionId: 8, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 9, value: ANSWER_VALUES.PARTIAL },
    { questionId: 10, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 11, value: ANSWER_VALUES.IMPLEMENTED },
    { questionId: 12, value: ANSWER_VALUES.PARTIAL },
  ];

  const result = calculateMSPIScore(mixedAnswers);
  
  // result.gaps will contain [3, 7] (question IDs with not_implemented)
  // result.totalScore will be calculated based on weighted domain scores
  // result.maturityLevel will be determined by totalScore thresholds

  return result;
}

