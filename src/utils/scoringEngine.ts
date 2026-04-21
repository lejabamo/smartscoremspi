import { Answer, Question, Domain, DomainScore, ScoringResult, MaturityLevel, ANSWER_VALUES, DOMAIN_WEIGHTS } from '../types/assessment';
import { MSPI_QUESTIONS } from '../data/questions';

/**
 * Pure TypeScript scoring engine for MSPI assessment
 * 
 * @param answers - Array of answers linked to questions
 * @param questions - Array of questions (defaults to MSPI_QUESTIONS)
 * @returns ScoringResult with totalScore, domainScores, maturityLevel, and gaps
 */
export function calculateMSPIScore(
  answers: Answer[],
  questions: Question[] = MSPI_QUESTIONS
): ScoringResult {
  // Create a map of answers by question ID for quick lookup
  const answerMap = new Map<number, Answer>();
  answers.forEach(answer => {
    answerMap.set(answer.questionId, answer);
  });

  // Calculate score per domain
  const domainScores: DomainScore[] = [];
  const gaps: number[] = [];

  for (const domain of Object.keys(DOMAIN_WEIGHTS) as Domain[]) {
    const domainQuestions = questions.filter(q => q.domain === domain);
    
    let domainScore = 0;
    let maxDomainScore = 0;

    domainQuestions.forEach(question => {
      const answer = answerMap.get(question.id);
      const maxQuestionScore = question.weight * ANSWER_VALUES.IMPLEMENTED;
      maxDomainScore += maxQuestionScore;

      // Treat missing answers as NOT_IMPLEMENTED (0)
      const answerValue = answer?.value ?? ANSWER_VALUES.NOT_IMPLEMENTED;
      const questionScore = answerValue * question.weight;
      domainScore += questionScore;

      // Track gaps (not_implemented answers, including missing ones)
      if (answerValue === ANSWER_VALUES.NOT_IMPLEMENTED) {
        gaps.push(question.id);
      }
    });

    // Calculate percentage for this domain
    const domainPercentage = maxDomainScore > 0 
      ? (domainScore / maxDomainScore) * 100 
      : 0;

    // Calculate weighted score
    const weightedScore = domainPercentage * DOMAIN_WEIGHTS[domain];

    domainScores.push({
      domain,
      score: domainScore,
      maxScore: maxDomainScore,
      percentage: Math.round(domainPercentage * 100) / 100, // Round to 2 decimals
      weightedScore: Math.round(weightedScore * 100) / 100, // Round to 2 decimals
    });
  }

  // Calculate total weighted score (0-100)
  const totalScore = Math.round(
    domainScores.reduce((sum, ds) => sum + ds.weightedScore, 0) * 100
  ) / 100;

  // Determine maturity level based on total score
  const maturityLevel = determineMaturityLevel(totalScore);

  return {
    totalScore,
    domainScores,
    maturityLevel,
    gaps: gaps.sort((a, b) => a - b), // Sort gaps by question ID
  };
}

/**
 * Determines maturity level based on total score
 * 
 * @param totalScore - Total weighted score (0-100)
 * @returns MaturityLevel
 */
function determineMaturityLevel(totalScore: number): MaturityLevel {
  if (totalScore >= 75) {
    return 'Optimizado';
  } else if (totalScore >= 50) {
    return 'Gestionado';
  } else if (totalScore >= 25) {
    return 'Básico';
  } else {
    return 'Inicial';
  }
}

/**
 * Validates that all required questions have answers
 * 
 * @param answers - Array of answers
 * @param questions - Array of questions (defaults to MSPI_QUESTIONS)
 * @returns true if all questions have answers, false otherwise
 */
export function validateAnswers(
  answers: Answer[],
  questions: Question[] = MSPI_QUESTIONS
): boolean {
  const answerQuestionIds = new Set(answers.map(a => a.questionId));
  const questionIds = new Set(questions.map(q => q.id));
  
  // Check if all questions have answers
  for (const questionId of questionIds) {
    if (!answerQuestionIds.has(questionId)) {
      return false;
    }
  }
  
  // Check if all answers correspond to valid questions
  for (const answer of answers) {
    if (!questionIds.has(answer.questionId)) {
      return false;
    }
  }
  
  return true;
}

