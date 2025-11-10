/**
 * Quick test for Gemini AI Service
 */
import { calculateATSScoreWithGemini } from './lib/geminiAtsService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGemini() {
  console.log('🧪 Testing Gemini AI Service...\n');
  
  // Test with a sample resume file
  const resumePath = path.join(__dirname, 'uploads', 'resumes', 'resume-11-1762579089481-harsh2_1.pdf');
  
  try {
    console.log('📄 Analyzing resume:', resumePath);
    console.log('⏳ This may take a few seconds...\n');
    
    const result = await calculateATSScoreWithGemini(resumePath, 'application/pdf');
    
    console.log('✅ Analysis complete!\n');
    console.log('📊 Results:');
    console.log('  - ATS Score:', result.atsScore, '/100');
    console.log('  - Rating:', result.rating);
    console.log('\n💪 Strengths:');
    result.strengths.forEach((strength, i) => {
      console.log(`  ${i + 1}. ${strength}`);
    });
    console.log('\n💡 Recommendations:');
    result.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
    
    console.log('\n✅ Gemini AI integration is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      console.log('\n⚠️  Please make sure GEMINI_API_KEY is set in your .env file');
    }
  }
}

testGemini();
