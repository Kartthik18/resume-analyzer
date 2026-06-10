// ──────────────────────────────────────────────────────
//  services/geminiService.js  —  Google Gemini AI Integration
//
//  This is the brain of the app. It:
//  1. Accepts the raw resume text (extracted from PDF)
//  2. Crafts a structured prompt asking Gemini for analysis
//  3. Sends the prompt to the Gemini API
//  4. Parses and returns the JSON response
//
//  Short note on how the prompting process works here:
//  
//  We use prompt engineering to tell the AI exactly what we want.
//  The key technique here is asking the model to respond ONLY in JSON
//  format so we can reliably parse the response in code.
//
//  We give the model:
//  - A role: "You are an expert ATS resume reviewer..."
//  - A task: Analyze this resume and return structured feedback
//  - Output format: Exactly this JSON structure
//  - The resume text: Injected at the end
// ──────────────────────────────────────────────────────

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client with our API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const MODEL_NAME = "gemini-3.5-flash";

/*
 * analyzeResume()
 * Sends resume text to Gemini and returns structured analysis.
 * @param {string} resumeText - Raw text extracted from the PDF
 * @returns {Object} - Parsed JSON object with ATS score, gaps, bullets, etc.
 */
const analyzeResume = async (resumeText) => {
  // Get the Gemini model instance
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // The Prompt: 
  // This is the instruction we send to Gemini.
  // We define:
  //   - The AI's role (expert resume reviewer)
  //   - The exact output format (strict JSON)
  //   - Each field we want with a description
  //   - The resume text to analyze
  const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer and career coach.
Analyze the resume text below and return ONLY a valid JSON object (no markdown, no explanation, no code blocks).

The JSON must follow this exact structure:
{
  "atsScore": <number between 0-100>,
  "strengths": [<array of 3-5 strength strings>],
  "weaknesses": [<array of 3-5 weakness strings>],
  "missingKeywords": [<array of 5-10 important keywords missing from the resume>],
  "skillGaps": [<array of 3-5 skill gaps relevant to the industry>],
  "improvedBullets": [<array of 3-5 improved versions of existing resume bullet points>],
  "suggestedProjects": [<array of 3-5 project ideas that would strengthen this resume>],
  "interviewQuestions": [<array of 5-8 likely interview questions based on this resume>]
}

Rules:
- atsScore should reflect how well the resume is optimized for applicant tracking systems
- strengths should highlight what the resume does well
- weaknesses should be specific and actionable
- missingKeywords should be real industry/role-specific terms
- skillGaps should suggest actual learnable skills
- improvedBullets should start with strong action verbs and include metrics where possible
- suggestedProjects should be realistic and relevant to their experience level
- interviewQuestions should range from behavioral to technical

Resume Text:
────────────
${resumeText}
────────────

Return ONLY the JSON object. No other text.
`;

  // Send to Gemini 
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();

  // Parse the Response
  // Gemini should return raw JSON, but sometimes it wraps it
  // in markdown code blocks. We strip those just in case.
  const cleanedText = rawText
    .replace(/```json/gi, "")  // Remove opening ```json
    .replace(/```/g, "")        // Remove closing ```
    .trim();

  // Parse the cleaned string into a JavaScript object
  const analysis = JSON.parse(cleanedText);

  return analysis;
};

module.exports = { analyzeResume };
