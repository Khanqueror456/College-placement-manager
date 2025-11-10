# Gemini AI Integration for ATS Resume Scoring

## Overview
This system now uses Google's Gemini AI to analyze student resumes and provide intelligent ATS (Applicant Tracking System) scores when students upload their resumes.

## Setup Instructions

### 1. Install Required Package

In the backend directory, install the Google Generative AI package:

```bash
cd backend
npm install @google/generative-ai
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the generated API key

### 3. Configure Environment Variables

Create or update your `.env` file in the `backend` directory:

```bash
# Google Gemini API Configuration (for ATS Resume Scoring)
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

Replace `your_actual_gemini_api_key_here` with your actual API key from step 2.

**Note:** The `.env` file is gitignored for security. Never commit your actual API keys to version control.

### 4. Verify Configuration

The configuration is already set up in `backend/config/config.js`:

```javascript
ai: {
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
}
```

## How It Works

### Resume Upload Flow

1. **Student uploads resume** → POST `/api/student/resume`
2. **File is saved** to `uploads/resumes/` directory
3. **Gemini AI analyzes** the resume content
4. **ATS Score calculated** (0-100) with detailed analysis
5. **Score saved** to student's `ats_score` field in database
6. **Response includes**:
   - ATS Score (0-100)
   - Rating (Excellent/Good/Average/Needs Improvement)
   - Strengths identified
   - Recommendations for improvement

### What Gemini Analyzes

The AI evaluates resumes based on:

- **Technical Skills (30 points)**: Programming languages, frameworks, tools
- **Experience (25 points)**: Internships, projects, work experience
- **Education (20 points)**: Degrees, certifications, GPA
- **Soft Skills (15 points)**: Leadership, communication, teamwork
- **Formatting (10 points)**: Structure, readability, keyword optimization

### API Response Example

```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resumeUrl": "/uploads/resumes/resume_1234567890.pdf",
  "filename": "resume_1234567890.pdf",
  "uploadedAt": "2025-11-08T10:30:00.000Z",
  "atsScore": 78,
  "atsAnalysis": {
    "rating": "Good",
    "strengths": [
      "Strong technical skills in web development",
      "Good project portfolio with practical experience",
      "Clear demonstration of problem-solving abilities"
    ],
    "recommendations": [
      "Add more quantifiable achievements (e.g., 'Improved performance by 40%')",
      "Include certifications or online courses completed",
      "Add keywords from job descriptions you're targeting",
      "Consider adding a professional summary section",
      "Mention team sizes and leadership roles more explicitly"
    ]
  }
}
```

## Database Schema

The `users` table includes the `ats_score` field:

```sql
ats_score INTEGER CHECK (ats_score >= 0 AND ats_score <= 100)
```

This field is automatically updated when a student uploads their resume.

## Files Modified/Created

### New Files
1. **`backend/lib/geminiAtsService.js`** - Gemini AI integration service
   - Extracts text from PDF/DOC files
   - Sends resume to Gemini for analysis
   - Parses and validates AI response

### Modified Files
1. **`backend/config/config.js`** - Added Gemini API configuration
2. **`backend/.env.example`** - Added Gemini API key template
3. **`backend/controllers/studentController.js`** - Updated `uploadResume` function to use Gemini

## Error Handling

If Gemini API fails (e.g., invalid API key, network issues), the resume upload will still succeed but without an ATS score:

- Resume is saved successfully
- `ats_score` remains NULL in database
- Error is logged to console
- Student receives upload confirmation

This ensures the system remains functional even if AI service is unavailable.

## Testing

### 1. Test Resume Upload

```bash
# Using curl (replace with actual token and file)
curl -X POST http://localhost:3000/api/student/resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/your/resume.pdf"
```

### 2. Check Console Output

Watch for these log messages:
```
🤖 Analyzing resume with Gemini AI...
✅ ATS Score calculated: 78/100
```

### 3. Verify Database

Check the student's `ats_score` field in the database:
```sql
SELECT name, email, ats_score, last_resume_update 
FROM users 
WHERE role = 'STUDENT' AND resume_path IS NOT NULL;
```

## Costs and Limits

- **Gemini 1.5 Flash** is optimized for speed and cost-efficiency
- Free tier: 15 requests per minute, 1 million requests per day
- For production: Consider implementing caching for re-analysis requests
- Monitor usage in [Google AI Studio](https://makersuite.google.com/)

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Ensure `.env` file exists in backend directory
- Verify `GEMINI_API_KEY` is set correctly
- Restart the backend server after updating `.env`

### "Failed to analyze resume with AI"
- Check API key is valid
- Verify internet connectivity
- Check Gemini API rate limits
- Review console for detailed error messages

### Resume uploads but no ATS score
- Check console logs for Gemini errors
- Verify resume file is readable (PDF or DOC format)
- Ensure resume has sufficient content (>100 characters)

## Future Enhancements

Potential improvements:
- Cache analysis results to avoid re-analyzing same resume
- Add re-analyze endpoint for students to update their score
- Show detailed breakdown in student dashboard
- Compare student scores across department/batch
- Generate improvement suggestions based on target job descriptions

## Security Notes

- API key is stored in environment variables (never in code)
- `.env` file is gitignored
- Resume files are only processed, not stored in AI service
- Student data privacy is maintained

---

**Need Help?** Check the [Google AI Documentation](https://ai.google.dev/docs) or review the implementation in `backend/lib/geminiAtsService.js`.
