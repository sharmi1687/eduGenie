export interface ProjectMetadata {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  category: string;
  difficulty: string;
  description: string;
  tamilVideoLink: string;
  docLink: string;
  commonTemplateLink: string;
  defaultPort: number;
}

export const PROJECT_LIST: ProjectMetadata[] = [
  {
    id: 'pocketsmart',
    title: 'PocketSmart AI',
    tagline: 'Your Smart Budget & Recommendation Assistant',
    icon: 'Wallet',
    category: 'Fintech & Personal Finance',
    difficulty: 'Beginner-Friendly',
    description: 'An AI-powered budget optimizer and financial coach that analyzes income vs expenses, detects overspending, and calculates personalized 50/30/20 breakdowns and savings strategies using Google Gemini.',
    tamilVideoLink: 'https://youtu.be/wPPI9-mK2P0',
    docLink: 'https://ai.google.dev',
    commonTemplateLink: 'https://github.com',
    defaultPort: 8000,
  },
  {
    id: 'legalease',
    title: 'LegalEase',
    tagline: 'AI-Powered Legal Document Generator',
    icon: 'FileText',
    category: 'LegalTech & Productivity',
    difficulty: 'Intermediate',
    description: 'Automated contract and agreement generator with intelligent risk clause analysis, plain-English executive summaries, jurisdiction compliance, and exportable legal agreements.',
    tamilVideoLink: 'https://youtu.be/wPPI9-mK2P0',
    docLink: 'https://ai.google.dev',
    commonTemplateLink: 'https://github.com',
    defaultPort: 8001,
  },
  {
    id: 'comiccraft',
    title: 'ComicCraft',
    tagline: 'AI Comic Story Creator using Gemini Models',
    icon: 'Sparkles',
    category: 'Creative Arts & Storytelling',
    difficulty: 'Creative & Engaging',
    description: 'Turn any premise into a multi-panel visual comic script complete with character designs, camera angles, atmospheric mood lighting, comic sound effects, and AI image prompts.',
    tamilVideoLink: 'https://youtu.be/wPPI9-mK2P0',
    docLink: 'https://ai.google.dev',
    commonTemplateLink: 'https://github.com',
    defaultPort: 8002,
  },
  {
    id: 'edugenie',
    title: 'EduGenie',
    tagline: 'Google Gemini Powered Learning Assistant',
    icon: 'GraduationCap',
    category: 'EdTech & Active Recall',
    difficulty: 'Intermediate',
    description: 'Empowers students with Feynman technique explanations, active-recall study flashcards, adaptive practice quizzes with real-time explanations, and concept break-downs.',
    tamilVideoLink: 'https://youtu.be/wPPI9-mK2P0',
    docLink: 'https://ai.google.dev',
    commonTemplateLink: 'https://github.com',
    defaultPort: 8003,
  },
  {
    id: 'fitbuddy',
    title: 'FitBuddy',
    tagline: 'AI Fitness Plan Generator using Gemini Models',
    icon: 'Dumbbell',
    category: 'Health & Wellness',
    difficulty: 'Beginner-Friendly',
    description: 'Generates tailored 7-day workout routines, set/rep targets, coach form cues, and personalized macro and meal planning adapted to student goals, gear, and schedules.',
    tamilVideoLink: 'https://youtu.be/wPPI9-mK2P0',
    docLink: 'https://ai.google.dev',
    commonTemplateLink: 'https://github.com',
    defaultPort: 8004,
  },
];

export function getFastApiProjectFiles(projectId: string) {
  const project = PROJECT_LIST.find((p) => p.id === projectId) || PROJECT_LIST[0];

  const mainPyCode = `"""
${project.title} - ${project.tagline}
Google Cloud Generative AI Student Project
Framework: FastAPI + Jinja2 + Google Gemini API (google-genai)
"""

import os
from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI App
app = FastAPI(
    title="${project.title}",
    description="${project.description}",
    version="1.0.0"
)

# Mount Static Files (CSS, JS, Images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure Jinja2 Templates Directory
templates = Jinja2Templates(directory="templates")

# Initialize Google GenAI client
# Ensure GEMINI_API_KEY is configured in your .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ai = genai.Client(api_key=GEMINI_API_KEY)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    Renders the main student project page using Jinja2 templates.
    """
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "project_title": "${project.title}",
            "tagline": "${project.tagline}",
        }
    )


@app.post("/api/generate")
async def generate(request: Request):
    """
    Core AI Endpoint that communicates with Google Gemini Model (gemini-2.5-flash / gemini-3.8-flash)
    """
    try:
        data = await request.json()
        user_prompt = data.get("prompt", "")

        if not user_prompt:
            return JSONResponse(
                status_code=400,
                content={"error": "Prompt cannot be empty"}
            )

        system_instruction = (
            "You are ${project.title}, ${project.tagline}. "
            "Provide helpful, structured, clear, and high-quality responses."
        )

        response = ai.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.7,
            }
        )

        return {
            "success": True,
            "result": response.text,
            "project": "${project.title}"
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


if __name__ == "__main__":
    import uvicorn
    # Run the ASGI server on port ${project.defaultPort}
    uvicorn.run("main:app", host="127.0.0.1", port=${project.defaultPort}, reload=True)
`;

  const indexHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ project_title }} - Google Cloud Generative AI</title>
  <link rel="stylesheet" href="/static/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header">
    <div class="container nav-content">
      <div class="brand">
        <span class="badge">Google Cloud GenAI Project</span>
        <h1>{{ project_title }}</h1>
        <p class="tagline">{{ tagline }}</p>
      </div>
      <div class="deadline-pill">
        <span>Submission Deadline: Oct 3, 2026</span>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="card hero-card">
      <h2>Interactive ${project.title} Interface</h2>
      <p>Powered by FastAPI, Uvicorn, Jinja2, and Google Gemini API.</p>

      <form id="ai-form" class="ai-form">
        <div class="form-group">
          <label for="prompt-input">Enter your parameters or prompt:</label>
          <textarea id="prompt-input" rows="4" placeholder="Type your input for ${project.title}..." required></textarea>
        </div>
        <button type="submit" id="submit-btn" class="btn btn-primary">
          <span id="btn-text">Generate with Gemini</span>
          <span id="btn-loader" class="loader" style="display:none;"></span>
        </button>
      </form>
    </section>

    <section id="result-section" class="card result-card" style="display:none;">
      <div class="result-header">
        <h3>Gemini Response</h3>
        <button id="copy-btn" class="btn btn-secondary">Copy Result</button>
      </div>
      <div id="output-box" class="output-box"></div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>Google Cloud Generative AI 4-Day Project Session Deliverable</p>
      <p class="small">Built with Python 3.10+, FastAPI, and Google Gemini</p>
    </div>
  </footer>

  <script>
    const form = document.getElementById('ai-form');
    const input = document.getElementById('prompt-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    const resultSection = document.getElementById('result-section');
    const outputBox = document.getElementById('output-box');
    const copyBtn = document.getElementById('copy-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;

      btnText.textContent = "Generating...";
      btnLoader.style.display = "inline-block";
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt })
        });
        const data = await response.json();

        if (data.success) {
          outputBox.textContent = data.result;
          resultSection.style.display = 'block';
          resultSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Error: ' + (data.error || 'Failed to generate content'));
        }
      } catch (err) {
        alert('Network or server error: ' + err.message);
      } finally {
        btnText.textContent = "Generate with Gemini";
        btnLoader.style.display = "none";
        submitBtn.disabled = false;
      }
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(outputBox.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy Result', 2000);
    });
  </script>
</body>
</html>
`;

  const styleCssCode = `/* ${project.title} - Modern Clean Stylesheet */
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --background: #f8fafc;
  --surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --radius: 12px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

body {
  background-color: var(--background);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 24px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.badge {
  display: inline-block;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}

.brand h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.tagline {
  color: var(--text-muted);
  font-size: 14px;
}

.deadline-pill {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

main {
  flex: 1;
  padding: 40px 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.hero-card h2 {
  font-size: 20px;
  margin-bottom: 6px;
}

.hero-card p {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: var(--primary);
  ring: 2px solid #bfdbfe;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: #f1f5f9;
  color: var(--text-main);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.output-box {
  background: #0f172a;
  color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 500px;
  overflow-y: auto;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 24px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.footer .small {
  font-size: 12px;
  margin-top: 4px;
}

.loader {
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

  const requirementsTxtCode = `fastapi==0.115.0
uvicorn[standard]==0.31.0
jinja2==3.1.4
google-genai==1.2.0
python-dotenv==1.0.1
pydantic==2.9.2
requests==2.32.3
`;

  const envExampleCode = `# Google Cloud Generative AI - API Configuration
# Get your Gemini API key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
PORT=${project.defaultPort}
APP_ENV=development
`;

  const readmeMdCode = `# ${project.title} - Google Cloud Generative AI Project

> **Tagline:** ${project.tagline}  
> **Student Resource:** 4-Day Project Session Track  
> **Final Project Submission Deadline:** Saturday, October 3, 2026

---

## 📌 Project Overview
${project.description}

This project is built following the official **Google Cloud Generative AI Common Template (GitHub)** and uses:
- **FastAPI** (High-performance Python web framework)
- **Uvicorn** (Lightning-fast ASGI server)
- **Jinja2** (Dynamic HTML templating)
- **Google Gemini API** (Google GenAI Python SDK)

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Prerequisites Check
- **Python 3.10+**: Verify by running:
  \`\`\`bash
  python --version
  \`\`\`
  *(Note: When installing Python, ensure you check "Add Python to PATH")*

### 2. Clone / Extract the Project
\`\`\`bash
git clone <your-repository-url>
cd ${project.id}-project
\`\`\`

### 3. Create a Virtual Environment (Recommended)
\`\`\`bash
# Windows
python -m venv venv
venv\\Scripts\\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
\`\`\`

### 4. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 5. Setup Environment Variables
1. Copy \`.env.example\` to \`.env\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
2. Open \`.env\` and add your Google Gemini API key:
   \`\`\`env
   GEMINI_API_KEY="AIzaSyYourActualKeyHere"
   \`\`\`

### 6. Run the Application with Uvicorn
\`\`\`bash
uvicorn main:app --reload --port ${project.defaultPort}
\`\`\`
Open your browser and navigate to:
**http://127.0.0.1:${project.defaultPort}**

---

## 📂 Project Structure
\`\`\`
├── main.py                  # FastAPI application routes & Gemini client
├── templates/
│   └── index.html           # Jinja2 frontend template
├── static/
│   └── style.css            # Responsive CSS styling
├── requirements.txt         # Python package dependencies
├── .env.example             # Example environment variables
└── README.md                # Project documentation & guide
\`\`\`

---

## 🎓 4-Day Project Milestones Checklist

- [x] **Day 1 (Phase 1):** Project Setup, Python 3.10+ installation & Gemini API key creation.
- [x] **Day 2 (Phase 2):** Backend development with FastAPI & prompt engineering.
- [x] **Day 3 (Phase 3):** Frontend design using Jinja2 templates & static CSS styling.
- [x] **Day 4 (Phase 4):** Final testing, recording demo video & submitting GitHub repository link.

---

## 🔗 Official Track Resources
- **4-Day Project Sessions Playlist:** [Watch on YouTube](https://www.youtube.com/playlist?list=PLaoUPVLOy8WM)
- **GitHub Creation & Project Submission Demo:** [Watch Demo Video](https://youtu.be/wPPI9-mK2P0)
- **Deadline:** Saturday, October 3, 2026
`;

  return {
    project,
    files: {
      'main.py': mainPyCode,
      'templates/index.html': indexHtmlCode,
      'static/style.css': styleCssCode,
      'requirements.txt': requirementsTxtCode,
      '.env.example': envExampleCode,
      'README.md': readmeMdCode,
    },
  };
}
