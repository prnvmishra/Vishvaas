import os
import json
import asyncio
import io
import re
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# Document Processing
import fitz  # PyMuPDF
import pdfplumber
import PyPDF2
from PIL import Image
import pytesseract
import cv2
import numpy as np

# AI & APIs
import httpx
import openai
import spacy

# Web Search
import googlesearch
from duckduckgo_search import DDGS
import wikipedia

app = FastAPI(title="VISHWAS - Full Production API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Warning: spaCy model not loaded")

# Full-featured document parser
def parse_document_full(file_bytes: bytes, filename: str) -> str:
    """Advanced document processing with all dependencies"""
    
    if filename.lower().endswith('.txt'):
        return file_bytes.decode('utf-8', errors='ignore')
    
    elif filename.lower().endswith('.pdf'):
        extracted_text = ""
        
        # Method 1: PyMuPDF (best)
        try:
            pdf_stream = io.BytesIO(file_bytes)
            doc = fitz.open(stream=pdf_stream, filetype="pdf")
            for page in doc:
                extracted_text += page.get_text()
            if len(extracted_text.strip()) > 50:
                return extracted_text
        except Exception as e:
            print(f"PyMuPDF error: {e}")
        
        # Method 2: pdfplumber
        try:
            pdf_stream = io.BytesIO(file_bytes)
            with pdfplumber.open(pdf_stream) as pdf:
                for page in pdf.pages:
                    extracted_text += page.extract_text() or ""
            if len(extracted_text.strip()) > 50:
                return extracted_text
        except Exception as e:
            print(f"pdfplumber error: {e}")
        
        # Method 3: PyPDF2
        try:
            pdf_stream = io.BytesIO(file_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_stream)
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() + "\n"
            if len(extracted_text.strip()) > 50:
                return extracted_text
        except Exception as e:
            print(f"PyPDF2 error: {e}")
        
        return f"Unable to extract text from PDF: {filename}"
    
    elif filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff')):
        # Image OCR processing
        try:
            image = Image.open(io.BytesIO(file_bytes))
            img_array = np.array(image)
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            extracted_text = pytesseract.image_to_string(gray)
            
            if len(extracted_text.strip()) > 20:
                return extracted_text
        except Exception as e:
            print(f"OCR error: {e}")
        
        return f"Unable to extract text from image: {filename}"
    
    else:
        try:
            if isinstance(file_bytes, bytes):
                decoded_text = file_bytes.decode('utf-8', errors='ignore')
                if len(decoded_text.strip()) > 50:
                    return decoded_text
        except:
            pass
        return f"Unsupported file type: {filename}"

# Advanced analysis with AI
async def analyze_document_full(text: str, filename: str) -> dict:
    """Complete analysis with all features"""
    
    # Basic regex extraction
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    email = email_match.group(0) if email_match else ""
    
    salary_match = re.search(r'(?:Rs\.?|₹|INR|\$)\s*([\d,\.]+)', text)
    salary = salary_match.group(1) if salary_match else ""
    
    # NLP extraction with spaCy
    company_name = "Unknown"
    role = "Unknown"
    
    try:
        doc = nlp(text)
        # Extract organizations
        organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
        if organizations:
            company_name = organizations[0]
        
        # Extract patterns for roles
        role_patterns = [
            r'(?:role|position)\s+(?:of|as)\s+([A-Za-z\s]+)',
            r'hiring\s+(?:for|a)\s+([A-Za-z\s]+)',
            r'(?:we are|looking for)\s+(?:a\s+)?([A-Za-z\s]+)'
        ]
        
        for pattern in role_patterns:
            role_match = re.search(pattern, text, re.IGNORECASE)
            if role_match:
                role = role_match.group(1).strip()
                break
    except Exception as e:
        print(f"NLP error: {e}")
    
    # OpenAI/Router AI Analysis
    ai_analysis = "AI analysis unavailable"
    risk_score = 0
    
    try:
        openrouter_key = os.getenv("OPENROUTER_API_KEY")
        if openrouter_key and len(text.strip()) > 20:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openrouter_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "openai/gpt-3.5-turbo",
                        "messages": [
                            {
                                "role": "user", 
                                "content": f"Analyze this job offer for legitimacy and extract key details:\n\n{text[:1500]}\n\nReturn JSON with: risk_score (0-100), company_name, role, salary, is_legitimate, concerns"
                            }
                        ]
                    }
                )
                
                if response.status_code == 200:
                    ai_result = response.json()
                    ai_analysis = ai_result["choices"][0]["message"]["content"]
                    
                    # Parse AI response
                    try:
                        import json
                        ai_data = json.loads(ai_analysis)
                        risk_score = ai_data.get("risk_score", 0)
                        if ai_data.get("company_name"):
                            company_name = ai_data["company_name"]
                        if ai_data.get("role"):
                            role = ai_data["role"]
                        if ai_data.get("salary"):
                            salary = ai_data["salary"]
                    except:
                        pass
    except Exception as e:
        print(f"AI analysis error: {e}")
        ai_analysis = "AI analysis failed"
    
    # Basic risk scoring
    if risk_score == 0:
        scam_phrases = ["registration fee", "urgent hiring", "limited seats", "pay to confirm"]
        if any(phrase in text.lower() for phrase in scam_phrases):
            risk_score += 40
        if "@gmail.com" in email or "@yahoo.com" in email:
            risk_score += 20
    
    risk_level = "Low Risk" if risk_score < 40 else "Medium Risk" if risk_score < 70 else "High Risk"
    
    return {
        "score": risk_score,
        "risk_level": risk_level,
        "extracted_data": {
            "company_name": company_name,
            "hr_email": email,
            "salary": salary,
            "role": role,
            "website": ""
        },
        "reasons": ["AI-powered analysis"],
        "raw_text": text[:300] + "..." if len(text) > 300 else text,
        "llm_analysis": ai_analysis,
        "verified_links": {},
        "ipqs_intel": None,
        "linkedin_jobs": None
    }

# Company intelligence with web search
async def get_company_intelligence(name: str) -> dict:
    """Complete company analysis with web search"""
    
    intelligence = {
        "size": "Unknown",
        "headquarters": "Unknown",
        "branches": "Unknown", 
        "industry": "Unknown",
        "mca_registration": "Not verified",
        "linkedin_url": "Unknown",
        "official_website": "Unknown",
        "summary": "No information available"
    }
    
    # Wikipedia search
    try:
        wiki_results = wikipedia.search(name, results=1)
        if wiki_results:
            summary = wikipedia.summary(wiki_results[0], sentences=3)
            intelligence["summary"] = summary
    except:
        pass
    
    # Google search
    try:
        search_results = googlesearch.search(f"{name} company official website", num_results=3)
        if search_results:
            intelligence["official_website"] = search_results[0]
    except:
        pass
    
    # DuckDuckGo search
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(f"{name} company information", max_results=3))
            if results:
                intelligence["summary"] = results[0]["body"]
    except:
        pass
    
    return intelligence

@app.get("/")
def read_root():
    return {"status": "VISHWAS Full Production Engine Running", "features": ["PDF", "OCR", "AI", "NLP", "Web Search"]}

@app.post("/analyze")
async def analyze_offer(file: UploadFile = File(...), firebase_uid: Optional[str] = Form(None)):
    try:
        file_bytes = await file.read()
        text = parse_document_full(file_bytes, file.filename)
        
        if not text or len(text.strip()) < 10:
            text = f"Unable to extract meaningful text from {file.filename}"
        
        result = await analyze_document_full(text, file.filename)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/company/{name}")
async def search_company(name: str):
    try:
        intelligence = await get_company_intelligence(name)
        
        return {
            "company": name,
            "is_verified_entity": bool(intelligence["official_website"] != "Unknown"),
            "links": {"website": intelligence["official_website"]},
            "intelligence": intelligence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
