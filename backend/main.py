import os
import json
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from openai import OpenAI
from weasyprint import HTML

load_dotenv()

app = FastAPI(title="Resume Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(os.getenv("CORS_ORIGINS", '["*"]')),
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url=os.getenv("LLM_BASE_URL"),
    api_key=os.getenv("LLM_API_KEY"),
)

PROFILE_PATH = Path(__file__).parent.parent / "data" / "profile.json"
PROFILE = json.loads(PROFILE_PATH.read_text())


class ResumeRequest(BaseModel):
    job_description: str


class ChatRequest(BaseModel):
    message: str


SYSTEM_PROMPT = f"""You are a resume tailoring expert. Given a job description, generate tailored resume content.

CANDIDATE PROFILE:
{json.dumps(PROFILE, indent=2)}

OUTPUT FORMAT (JSON only, no markdown):
{{
  "career_objective": "2-3 sentence tailored summary highlighting relevant experience",
  "experience": [
    {{
      "company": "...",
      "role": "...",
      "location": "...",
      "period": "...",
      "bullets": ["tailored bullet 1", "tailored bullet 2", "..."]
    }}
  ],
  "projects": [
    {{
      "name": "...",
      "tech": "Tech1, Tech2, Tech3",
      "bullets": ["tailored bullet 1", "tailored bullet 2"]
    }}
  ],
  "skills": {{
    "Languages": "Python, Java",
    "Backend": "FastAPI, Django, ...",
    "Databases": "PostgreSQL, MongoDB, ...",
    "Cloud & DevOps": "AWS, Docker, ...",
    "Tools": "REST APIs, Git, ..."
  }}
}}

RULES:
- Prioritize experiences/projects matching the JD
- Reword bullets to emphasize relevant skills
- Keep all facts accurate, only reframe emphasis
- Return ONLY valid JSON, no explanation"""


RESUME_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {{ size: A4; margin: 0.5in; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; color: #000; }}
.header {{ text-align: center; margin-bottom: 8px; }}
.header h1 {{ font-size: 18pt; font-weight: bold; margin-bottom: 4px; }}
.header .contact {{ font-size: 10pt; }}
.header .contact a {{ color: #000; text-decoration: none; }}
.section {{ margin-bottom: 10px; }}
.section-title {{ font-size: 12pt; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 6px; padding-bottom: 2px; }}
.objective {{ text-align: justify; }}
.exp-item, .proj-item {{ margin-bottom: 8px; }}
.exp-header {{ display: flex; justify-content: space-between; font-weight: bold; }}
.exp-sub {{ display: flex; justify-content: space-between; font-style: italic; font-size: 10pt; }}
.proj-header {{ font-weight: bold; }}
.proj-tech {{ font-style: italic; font-size: 10pt; }}
ul {{ margin-left: 18px; }}
li {{ margin-bottom: 2px; text-align: justify; }}
.skills-grid {{ display: grid; grid-template-columns: 120px 1fr; gap: 2px 8px; }}
.skill-cat {{ font-weight: bold; }}
.edu-header {{ display: flex; justify-content: space-between; }}
.edu-sub {{ font-style: italic; font-size: 10pt; }}
</style>
</head>
<body>
<div class="header">
<h1>{name}</h1>
<div class="contact">
{location} | {phone} | {email}<br>
<a href="{linkedin}">LinkedIn</a> | <a href="{github}">GitHub</a> | <a href="{leetcode}">LeetCode</a>
</div>
</div>

<div class="section">
<div class="section-title">CAREER OBJECTIVE</div>
<p class="objective">{career_objective}</p>
</div>

<div class="section">
<div class="section-title">PROFESSIONAL EXPERIENCE</div>
{experience_html}
</div>

<div class="section">
<div class="section-title">PROJECTS</div>
{projects_html}
</div>

<div class="section">
<div class="section-title">TECHNICAL SKILLS</div>
<div class="skills-grid">{skills_html}</div>
</div>

<div class="section">
<div class="section-title">EDUCATION</div>
{education_html}
</div>
</body>
</html>"""


def build_experience_html(experience: list) -> str:
    html = ""
    for exp in experience:
        bullets = "".join(f"<li>{b}</li>" for b in exp["bullets"])
        html += f"""<div class="exp-item">
<div class="exp-header"><span>{exp['company']}</span><span>{exp['period']}</span></div>
<div class="exp-sub"><span>{exp['role']}</span><span>{exp['location']}</span></div>
<ul>{bullets}</ul>
</div>"""
    return html


def build_projects_html(projects: list) -> str:
    html = ""
    for proj in projects:
        bullets = "".join(f"<li>{b}</li>" for b in proj["bullets"])
        html += f"""<div class="proj-item">
<div class="proj-header">{proj['name']}</div>
<div class="proj-tech">{proj['tech']}</div>
<ul>{bullets}</ul>
</div>"""
    return html


def build_skills_html(skills: dict) -> str:
    return "".join(f'<span class="skill-cat">{k}:</span><span>{v}</span>' for k, v in skills.items())


def build_education_html() -> str:
    edu = PROFILE["education"][0]
    return f"""<div class="edu-header"><span>{edu['institution']}</span><span>{edu['start']} - {edu['end']}</span></div>
<div class="edu-sub">{edu['degree']} | CGPA: {edu['cgpa']}</div>"""


@app.post("/generate-resume")
async def generate_resume(req: ResumeRequest):
    try:
        response = client.chat.completions.create(
            model=os.getenv("LLM_MODEL"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Tailor resume for this job:\n\n{req.job_description}"},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        content = json.loads(response.choices[0].message.content)
        
        html = RESUME_TEMPLATE.format(
            name=PROFILE["name"],
            location=PROFILE["location"],
            phone=PROFILE["phone"],
            email=PROFILE["email"],
            linkedin=PROFILE["linkedin"],
            github=PROFILE["github"],
            leetcode=PROFILE["leetcode"],
            career_objective=content["career_objective"],
            experience_html=build_experience_html(content["experience"]),
            projects_html=build_projects_html(content["projects"]),
            skills_html=build_skills_html(content["skills"]),
            education_html=build_education_html(),
        )
        
        pdf = HTML(string=html).write_pdf()
        return Response(content=pdf, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=resume.pdf"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


CHAT_SYSTEM_PROMPT = f"""You are Mritunjay — a friendly backend engineer chatting on your portfolio website.

YOUR PROFILE:
{json.dumps(PROFILE, indent=2)}

PERSONALITY:
- Speak naturally like texting a friend, not formal
- Use casual language: "Yeah", "Pretty much", "Honestly", "I'd say"
- Show enthusiasm about tech you love
- Keep it short — 1-3 sentences max unless asked for details
- Use occasional emojis sparingly (1 max per response)
- Be humble but confident

EXAMPLES:
Q: "What do you do?"
A: "I'm a backend engineer — mostly building APIs and microservices with Python. Currently working at Kogta Financial where I handle systems processing 100K+ messages daily 🚀"

Q: "What's your tech stack?"
A: "Python's my bread and butter — FastAPI, Flask, Django. For databases I work with PostgreSQL, MongoDB, and Redis. Also do a lot with AWS SQS for async stuff."

Q: "Are you available for hire?"
A: "Yeah, I'm open to interesting opportunities! Feel free to reach out at mritunjaypratapsinghh@gmail.com"

RULES:
- Only discuss what's in your profile
- For off-topic questions: "Haha, I'm better at talking about code! Ask me about my projects or experience?"
- Never make up information not in your profile"""


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=os.getenv("LLM_MODEL"),
            messages=[
                {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                {"role": "user", "content": req.message},
            ],
            temperature=0.7,
            max_tokens=300,
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from fastapi.responses import StreamingResponse

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    def generate():
        stream = client.chat.completions.create(
            model=os.getenv("LLM_MODEL"),
            messages=[
                {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                {"role": "user", "content": req.message},
            ],
            temperature=0.7,
            max_tokens=300,
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
