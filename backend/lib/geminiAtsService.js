/**
 * Gemini AI-powered ATS Resume Scoring Service
 * Uses Google Gemini API for intelligent resume analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import config from '../config/config.js';

// Import CommonJS module - pdf-parse
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Initialize Gemini AI
 */
let genAI = null;
let model = null;

function initializeGemini() {
  if (!config.ai.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  
  genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
  // Use gemini-flash-latest for the stable flash model
  model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
}

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
 * Extract text from DOC/DOCX files
 */
function extractTextFromDoc(filePath) {
  try {
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
 * Analyze resume using Gemini AI
 */
async function analyzeResumeWithGemini(resumeText) {
  try {
    // Initialize Gemini if not already done
    if (!model) {
      initializeGemini();
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume and provide a comprehensive evaluation.

RESUME TEXT:
${resumeText}

Please analyze this resume and provide a detailed JSON response with the following structure:

{
  "atsScore": <number between 0-100>,
  "breakdown": {
    "technical": <score 0-30 based on technical skills, programming languages, frameworks>,
    "experience": <score 0-25 based on work experience, internships, projects>,
    "education": <score 0-20 based on degrees, certifications, GPA>,
    "softSkills": <score 0-15 based on leadership, communication, teamwork>,
    "formatting": <score 0-10 based on structure, readability, keyword optimization>
  },
  "strengths": [
    <list of 3-5 key strengths found in the resume>
  ],
  "weaknesses": [
    <list of 3-5 areas for improvement>
  ],
  "recommendations": [
    <list of 5-7 specific actionable recommendations to improve the resume>
  ],
  "keySkills": [
    <list of technical and professional skills identified>
  ],
  "extractedSkills": {
    "programming_languages": [<list of programming languages like "Python", "Java", "JavaScript", "C++", etc.>],
    "frameworks": [<list of frameworks like "React", "Node.js", "Django", "Spring Boot", etc.>],
    "databases": [<list of databases like "MySQL", "MongoDB", "PostgreSQL", etc.>],
    "cloud_platforms": [<list of cloud platforms like "AWS", "Azure", "GCP", etc.>],
    "tools": [<list of tools like "Git", "Docker", "Kubernetes", "Jenkins", etc.>],
    "soft_skills": [<list of soft skills like "Leadership", "Communication", "Teamwork", etc.>]
  },
  "rating": <"Excellent" | "Good" | "Average" | "Needs Improvement">,
  "summary": <brief 2-3 sentence summary of the candidate's profile>
}

Important guidelines:
1. Be strict but fair in scoring
2. Focus on ATS optimization (keyword presence, formatting, structure)
3. Consider relevance for placement/campus recruitment
4. Provide specific, actionable recommendations
5. Ensure the atsScore is calculated as: technical + experience + education + softSkills + formatting
6. Extract ALL technical skills found in the resume and categorize them properly
7. Be comprehensive in skill extraction - don't miss any mentioned skills
6. Return ONLY valid JSON, no additional text or markdown formatting
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const analysis = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!analysis.atsScore || typeof analysis.atsScore !== 'number') {
      throw new Error('Invalid ATS score in Gemini response');
    }
    
    // Ensure score is between 0 and 100
    analysis.atsScore = Math.max(0, Math.min(100, Math.round(analysis.atsScore)));
    
    return analysis;
    
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    throw new Error('Failed to analyze resume with AI: ' + error.message);
  }
}

/**
 * Main function to calculate ATS score using Gemini
 */
export async function calculateATSScoreWithGemini(filePath, mimeType) {
  try {
    // Extract text from resume
    const text = await extractText(filePath, mimeType);

    if (!text || text.trim().length < 100) {
      throw new Error('Resume content is too short or empty');
    }

    // Analyze with Gemini AI
    const analysis = await analyzeResumeWithGemini(text);
    
    // Add metadata
    analysis.metadata = {
      analyzedAt: new Date().toISOString(),
      wordCount: text.split(/\s+/).length,
      fileType: mimeType,
      aiModel: config.ai.geminiModel,
      method: 'gemini-ai'
    };

    return analysis;

  } catch (error) {
    console.error('Error in calculateATSScoreWithGemini:', error);
    throw error;
  }
}

/**
 * Get quick ATS score (just the number)
 */
export async function getQuickATSScore(filePath, mimeType) {
  try {
    const analysis = await calculateATSScoreWithGemini(filePath, mimeType);
    return analysis.atsScore;
  } catch (error) {
    console.error('Error getting quick ATS score:', error);
    throw error;
  }
}

export default {
  calculateATSScoreWithGemini,
  getQuickATSScore
};
