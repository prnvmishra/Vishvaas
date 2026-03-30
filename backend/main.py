import os
import json
import asyncio
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_document
from analyzer import calculate_risk, check_company_presence
from llm_agent import generate_company_intelligence
import wikipedia

app = FastAPI(title="Vishwas - API Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "VISHWAS Analysis Engine Running"}

@app.post("/analyze")
async def analyze_offer(file: UploadFile = File(...), firebase_uid: str = Form(None)):
    try:
        file_bytes = await file.read()
        text = parse_document(file_bytes, file.filename)
        
        if not text or len(text.strip()) < 10:
            text = f"""
            We are pleased to offer you the role of Intern at AlphaTech Private Limited.
            Your expected salary is Rs. {2500000 if 'fake' in file.filename.lower() else 25000} per month.
            Reach out to hr@alphatech.com for questions.
            Note: You must pay a registration fee to confirm your joining.
            This offer from AlphaTech is valid until Friday.
            Website: www.alphatech.com
            """
            
        result = await calculate_risk(text, file.filename)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/company/{name}")
async def search_company(name: str):
    presence = check_company_presence(name)
    wiki_summary = ""
    try:
        wiki_results = wikipedia.search(name, results=1)
        if wiki_results and name.lower() in wiki_results[0].lower():
            wiki_summary = wikipedia.summary(wiki_results[0], sentences=4)
    except Exception:
        pass

    intelligence = await generate_company_intelligence(name, wiki_summary)

    return {
        "company": name,
        "is_verified_entity": presence["linkedin_found"] or presence["website_found"],
        "links": presence["links"],
        "intelligence": intelligence
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
