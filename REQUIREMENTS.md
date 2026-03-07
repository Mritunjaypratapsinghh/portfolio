# GitHub Portfolio + AI Resume Generator — Requirements

## 1. Portfolio Page (Frontend)

| Section | Content |
|---|---|
| Hero | Name, title, tagline, photo, CTA buttons (GitHub, LinkedIn, Download Resume) |
| About | Short bio, background |
| Skills | Grouped by category with icons (Languages, Backend, Databases, Cloud, Tools, Concepts) |
| Projects | Cards with description, tech stack tags, GitHub/demo links |
| Experience | Timeline — role, company, dates, bullet points |
| Education | Degree, institution, year, CGPA |
| Contact | Email, LinkedIn, GitHub |

- Tech: Static HTML + CSS + Vanilla JS
- Responsive, mobile-friendly
- Data-driven from `profile.json`

## 2. Resume Generator

| Step | Action |
|---|---|
| 1 | User clicks "Download Resume" on portfolio |
| 2 | Modal opens → paste job description |
| 3 | Click "Generate" → loading spinner |
| 4 | Backend sends profile.json + JD to LLM |
| 5 | LLM returns tailored content as structured JSON |
| 6 | Content injected into HTML/CSS resume template (exact format as original PDF) |
| 7 | HTML → PDF (WeasyPrint) → Download |

- LLM only generates content, NOT format
- Resume template matches original PDF layout exactly
- ATS-friendly: single column, standard headers, standard fonts

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | HTML + CSS + Vanilla JS |
| Backend | Python FastAPI |
| LLM (local) | Ollama → llama3.2 |
| LLM (prod) | Groq → llama-3.3-70b-versatile |
| PDF | WeasyPrint |
| Data | profile.json |
| Hosting | GitHub Pages (frontend) + Render/Railway (backend) |

## 4. Architecture

```
profile.json (single source of truth)
    ├── Feeds portfolio page (frontend renders all sections)
    └── Feeds resume generator (system prompt context)

Frontend (GitHub Pages)
    → API call → FastAPI Backend (Render)
                    → Groq API (llama-3.3-70b)
                    → Structured JSON response
                    → Inject into HTML resume template
                    → WeasyPrint → PDF
                    → Return PDF download
```

## 5. LLM Integration

- OpenAI-compatible SDK (works with both Ollama and Groq)
- Context stuffing: full profile.json in system prompt
- Env-based provider switching:
  - Local: `LLM_BASE_URL=http://localhost:11434/v1`
  - Prod: `LLM_BASE_URL=https://api.groq.com/openai/v1`
- Groq API key: reuse from job-tracker project

## 6. Resume Output Format (Matches Original PDF)

- Header: Name, location, phone, email, LinkedIn, GitHub, LeetCode
- Career Objective (tailored summary)
- Experience (company, role, location, dates, bullets)
- Projects (name, tech stack, bullets)
- Technical Skills (categorized)
- Education (university, degree, dates, CGPA)
