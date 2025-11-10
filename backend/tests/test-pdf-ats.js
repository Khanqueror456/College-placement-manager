/**
 * Test ATS Scoring with Real PDF
 * Tests the Sample Resumes.pdf file
 */

import { calculateATSScore } from './lib/atsScoreService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing ATS Scoring with Real PDF\n');
console.log('=' .repeat(60));

async function testRealPDF() {
  try {
    const pdfPath = path.join(__dirname, 'uploads', 'documents', 'Sample Resumes.pdf');
    const mimeType = 'application/pdf';
    
    console.log('📄 Analyzing PDF: Sample Resumes.pdf');
    console.log(`📍 Location: ${pdfPath}\n`);
    console.log('⏳ Calculating ATS Score (this may take a moment)...\n');
    
    const startTime = Date.now();
    
    // Calculate ATS score
    const analysis = await calculateATSScore(pdfPath, mimeType);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('✅ Analysis Complete!\n');
    console.log('=' .repeat(60));
    console.log(`📊 ATS SCORE: ${analysis.totalScore}/100`);
    console.log(`⭐ RATING: ${analysis.rating}`);
    console.log(`⏱️  Analysis Time: ${duration} seconds`);
    console.log('=' .repeat(60));
    
    // Display breakdown
    console.log('\n📈 SCORE BREAKDOWN:');
    console.log(`   Technical Skills:  ${analysis.breakdown.technical}/30`);
    console.log(`   Structure:         ${analysis.breakdown.structure}/20`);
    console.log(`   Action Verbs:      ${analysis.breakdown.actionVerbs}/15`);
    console.log(`   Achievements:      ${analysis.breakdown.achievements}/20`);
    console.log(`   Formatting:        ${analysis.breakdown.formatting}/15`);
    
    // Display keywords found
    console.log('\n🔑 KEYWORDS DETECTED:');
    
    if (analysis.keywords.technical) {
      console.log('\n   Technical Skills:');
      if (analysis.keywords.technical.programming?.matches?.length > 0) {
        console.log(`      Programming: ${analysis.keywords.technical.programming.matches.join(', ')}`);
      }
      if (analysis.keywords.technical.frameworks?.matches?.length > 0) {
        console.log(`      Frameworks:  ${analysis.keywords.technical.frameworks.matches.join(', ')}`);
      }
      if (analysis.keywords.technical.databases?.matches?.length > 0) {
        console.log(`      Databases:   ${analysis.keywords.technical.databases.matches.join(', ')}`);
      }
      if (analysis.keywords.technical.cloud?.matches?.length > 0) {
        console.log(`      Cloud/DevOps: ${analysis.keywords.technical.cloud.matches.join(', ')}`);
      }
      if (analysis.keywords.technical.tools?.matches?.length > 0) {
        console.log(`      Tools:       ${analysis.keywords.technical.tools.matches.join(', ')}`);
      }
    }
    
    if (analysis.keywords.actionVerbs?.matches?.length > 0) {
      console.log(`\n   Action Verbs: ${analysis.keywords.actionVerbs.matches.slice(0, 10).join(', ')}${analysis.keywords.actionVerbs.matches.length > 10 ? '...' : ''}`);
    }
    
    // Display sections found
    if (analysis.keywords.structure) {
      console.log('\n📋 RESUME STRUCTURE:');
      console.log(`   Contact Info:  ${analysis.keywords.structure.hasContact ? '✓' : '✗'}`);
      console.log(`   Education:     ${analysis.keywords.structure.hasEducation ? '✓' : '✗'}`);
      console.log(`   Experience:    ${analysis.keywords.structure.hasExperience ? '✓' : '✗'}`);
      console.log(`   Skills:        ${analysis.keywords.structure.hasSkills ? '✓' : '✗'}`);
      console.log(`   Summary:       ${analysis.keywords.structure.hasSummary ? '✓' : '✗'}`);
    }
    
    // Display metrics
    if (analysis.keywords.achievements) {
      console.log('\n📊 QUANTIFIABLE ACHIEVEMENTS:');
      console.log(`   Has Metrics:   ${analysis.keywords.achievements.hasMetrics ? 'Yes ✓' : 'No ✗'}`);
      console.log(`   Metric Count:  ${analysis.keywords.achievements.count}`);
    }
    
    // Display strengths
    if (analysis.strengths?.length > 0) {
      console.log('\n💪 STRENGTHS:');
      analysis.strengths.forEach(strength => {
        console.log(`   ✓ ${strength}`);
      });
    }
    
    // Display weaknesses
    if (analysis.weaknesses?.length > 0) {
      console.log('\n⚠️  WEAKNESSES:');
      analysis.weaknesses.forEach(weakness => {
        console.log(`   • ${weakness}`);
      });
    }
    
    // Display recommendations
    if (analysis.recommendations?.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      analysis.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
    
    // Metadata
    if (analysis.metadata) {
      console.log('\n📝 METADATA:');
      console.log(`   Word Count:    ${analysis.metadata.wordCount}`);
      console.log(`   Analyzed At:   ${new Date(analysis.metadata.analyzedAt).toLocaleString()}`);
      console.log(`   File Type:     ${analysis.metadata.fileType}`);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ PDF Analysis Test Complete!\n');
    
    // Summary
    if (analysis.totalScore >= 85) {
      console.log('🌟 EXCELLENT! This resume is highly optimized for ATS systems.');
    } else if (analysis.totalScore >= 70) {
      console.log('⭐ GOOD! This resume should pass most ATS systems.');
    } else if (analysis.totalScore >= 50) {
      console.log('👍 AVERAGE. Consider implementing the recommendations above.');
    } else {
      console.log('📝 NEEDS IMPROVEMENT. Follow the recommendations to enhance your resume.');
    }
    
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error(`Error: ${error.message}`);
    console.error(`\nStack: ${error.stack}`);
  }
}

// Run test
testRealPDF();
