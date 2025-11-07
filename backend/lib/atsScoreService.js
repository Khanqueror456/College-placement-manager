/**
 * ATS (Applicant Tracking System) Resume Scoring Service
 * Analyzes resumes and provides scores based on various criteria
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// Import CommonJS module - pdf-parse v1.1.1
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Keywords for different categories
 */
const KEYWORDS = {
  technical: {
    programming: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'kotlin', 'swift', 'typescript', 'sql', 'html', 'css'],
    frameworks: ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', '.net', 'next.js', 'nuxt'],
    databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sql server', 'dynamodb', 'cassandra', 'elasticsearch'],
    cloud: ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible'],
    tools: ['git', 'github', 'gitlab', 'jira', 'postman', 'vs code', 'intellij', 'eclipse', 'maven', 'gradle', 'npm', 'webpack'],
    concepts: ['oop', 'design patterns', 'data structures', 'algorithms', 'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'devops', 'testing', 'tdd', 'solid']
  },
  soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'creative', 'organized', 'detail-oriented', 'adaptable', 'collaborative'],
  action: ['developed', 'created', 'implemented', 'designed', 'built', 'led', 'managed', 'improved', 'optimized', 'achieved', 'delivered', 'launched', 'coordinated', 'analyzed'],
  education: ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'bca', 'mca', 'b.e', 'm.e', 'degree', 'diploma', 'certification', 'certified'],
  experience: ['internship', 'project', 'experience', 'worked', 'volunteered', 'contributed', 'participated', 'hackathon', 'competition']
};

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Extract text from DOC/DOCX files (basic implementation)
 */
function extractTextFromDoc(filePath) {
  try {
    // For now, read as text. For proper DOCX parsing, use mammoth package
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error extracting DOC text:', error);
    throw new Error('Failed to parse DOC file');
  }
}

/**
 * Extract text based on file type
 */
async function extractText(filePath, mimeType) {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractTextFromDoc(filePath);
  } else {
    throw new Error('Unsupported file type');
  }
}

/**
 * Count keyword matches in text
 */
function countKeywords(text, keywords) {
  const lowerText = text.toLowerCase();
  let matches = [];
  let count = 0;

  keywords.forEach(keyword => {
    // Escape special regex characters
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    const keywordMatches = lowerText.match(regex);
    if (keywordMatches) {
      count += keywordMatches.length;
      matches.push(keyword);
    }
  });

  return { count, matches: [...new Set(matches)] };
}

/**
 * Analyze resume structure
 */
function analyzeStructure(text) {
  const lowerText = text.toLowerCase();
  const sections = {
    hasContact: /email|phone|linkedin|github|portfolio/.test(lowerText),
    hasEducation: /education|academic|degree|university|college/.test(lowerText),
    hasExperience: /experience|work|employment|internship|project/.test(lowerText),
    hasSkills: /skills|technical|technologies|tools|languages/.test(lowerText),
    hasSummary: /summary|objective|profile|about/.test(lowerText),
  };

  const score = Object.values(sections).filter(Boolean).length * 10;
  return { sections, score };
}

/**
 * Check for quantifiable achievements
 */
function analyzeAchievements(text) {
  const percentageMatches = text.match(/\d+%/g) || [];
  const numberMatches = text.match(/\b\d+\b/g) || [];
  const hasMetrics = percentageMatches.length > 0 || numberMatches.length > 2;
  
  return {
    hasMetrics,
    count: percentageMatches.length + Math.min(numberMatches.length, 5),
    score: Math.min((percentageMatches.length * 5) + (Math.min(numberMatches.length, 5) * 2), 20)
  };
}

/**
 * Analyze formatting and readability
 */
function analyzeFormatting(text) {
  const wordCount = text.split(/\s+/).length;
  const lineCount = text.split(/\n/).length;
  
  let score = 0;
  const issues = [];
  const recommendations = [];

  // Optimal word count: 400-800 words
  if (wordCount >= 400 && wordCount <= 800) {
    score += 10;
  } else if (wordCount < 400) {
    issues.push('Resume is too short');
    recommendations.push('Add more details about your experience and projects');
    score += 5;
  } else if (wordCount > 1200) {
    issues.push('Resume is too long');
    recommendations.push('Keep resume concise, ideally 1-2 pages');
    score += 5;
  } else {
    score += 8;
  }

  // Check for proper sections (line breaks indicate structure)
  if (lineCount > 20) {
    score += 5;
  }

  return { wordCount, score, issues, recommendations };
}

/**
 * Main ATS scoring function
 */
export async function calculateATSScore(filePath, mimeType) {
  try {
    // Extract text from resume
    const text = await extractText(filePath, mimeType);

    if (!text || text.trim().length < 100) {
      throw new Error('Resume content is too short or empty');
    }

    // Initialize analysis object
    const analysis = {
      totalScore: 0,
      breakdown: {},
      keywords: {},
      recommendations: [],
      strengths: [],
      weaknesses: []
    };

    // 1. Technical Skills Analysis (30 points)
    const technicalAnalysis = {
      programming: countKeywords(text, KEYWORDS.technical.programming),
      frameworks: countKeywords(text, KEYWORDS.technical.frameworks),
      databases: countKeywords(text, KEYWORDS.technical.databases),
      cloud: countKeywords(text, KEYWORDS.technical.cloud),
      tools: countKeywords(text, KEYWORDS.technical.tools),
      concepts: countKeywords(text, KEYWORDS.technical.concepts)
    };

    const totalTechnicalKeywords = Object.values(technicalAnalysis).reduce((sum, val) => sum + val.count, 0);
    const technicalScore = Math.min(Math.round((totalTechnicalKeywords / 20) * 30), 30);
    analysis.breakdown.technical = technicalScore;
    analysis.keywords.technical = technicalAnalysis;

    if (technicalScore >= 25) {
      analysis.strengths.push('Strong technical skills showcase');
    } else if (technicalScore < 15) {
      analysis.weaknesses.push('Limited technical keywords');
      analysis.recommendations.push('Add more specific technical skills and technologies you\'ve worked with');
    }

    // 2. Structure Analysis (20 points)
    const structure = analyzeStructure(text);
    analysis.breakdown.structure = structure.score;
    analysis.keywords.structure = structure.sections;

    if (structure.score >= 40) {
      analysis.strengths.push('Well-structured resume with all key sections');
    } else {
      if (!structure.sections.hasContact) {
        analysis.recommendations.push('Add clear contact information section');
      }
      if (!structure.sections.hasSkills) {
        analysis.recommendations.push('Include a dedicated skills section');
      }
      if (!structure.sections.hasSummary) {
        analysis.recommendations.push('Add a professional summary or objective');
      }
    }

    // 3. Action Verbs Analysis (15 points)
    const actionVerbs = countKeywords(text, KEYWORDS.action);
    const actionScore = Math.min(Math.round((actionVerbs.count / 10) * 15), 15);
    analysis.breakdown.actionVerbs = actionScore;
    analysis.keywords.actionVerbs = actionVerbs;

    if (actionScore >= 12) {
      analysis.strengths.push('Good use of action verbs');
    } else {
      analysis.weaknesses.push('Limited use of strong action verbs');
      analysis.recommendations.push('Start bullet points with strong action verbs like "developed", "implemented", "led"');
    }

    // 4. Achievements/Metrics Analysis (20 points)
    const achievements = analyzeAchievements(text);
    analysis.breakdown.achievements = achievements.score;
    analysis.keywords.achievements = { hasMetrics: achievements.hasMetrics, count: achievements.count };

    if (achievements.score >= 15) {
      analysis.strengths.push('Quantifiable achievements demonstrated');
    } else {
      analysis.weaknesses.push('Lack of quantifiable achievements');
      analysis.recommendations.push('Include measurable results (e.g., "Improved performance by 30%")');
    }

    // 5. Formatting/Readability (15 points)
    const formatting = analyzeFormatting(text);
    analysis.breakdown.formatting = formatting.score;
    analysis.keywords.formatting = { wordCount: formatting.wordCount };

    if (formatting.issues.length > 0) {
      analysis.weaknesses.push(...formatting.issues);
    }
    if (formatting.recommendations.length > 0) {
      analysis.recommendations.push(...formatting.recommendations);
    }

    // Calculate total score
    analysis.totalScore = Object.values(analysis.breakdown).reduce((sum, val) => sum + val, 0);

    // Add overall rating
    if (analysis.totalScore >= 85) {
      analysis.rating = 'Excellent';
      analysis.strengths.push('Resume is highly optimized for ATS systems');
    } else if (analysis.totalScore >= 70) {
      analysis.rating = 'Good';
    } else if (analysis.totalScore >= 50) {
      analysis.rating = 'Average';
      analysis.recommendations.push('Consider enhancing your resume with more details and keywords');
    } else {
      analysis.rating = 'Needs Improvement';
      analysis.recommendations.push('Resume needs significant improvements to pass ATS screening');
    }

    // Add metadata
    analysis.metadata = {
      analyzedAt: new Date().toISOString(),
      wordCount: formatting.wordCount,
      fileType: mimeType
    };

    return analysis;

  } catch (error) {
    console.error('Error calculating ATS score:', error);
    throw error;
  }
}

/**
 * Get ATS recommendations based on score
 */
export function getRecommendations(score, analysis) {
  const recommendations = [...analysis.recommendations];

  if (score < 50) {
    recommendations.push('Focus on adding relevant technical skills and certifications');
    recommendations.push('Use industry-standard keywords from job descriptions');
  }

  if (score < 70) {
    recommendations.push('Ensure all sections (Contact, Education, Experience, Skills) are present');
    recommendations.push('Add more details about projects and internships');
  }

  return [...new Set(recommendations)]; // Remove duplicates
}

export default {
  calculateATSScore,
  getRecommendations
};
