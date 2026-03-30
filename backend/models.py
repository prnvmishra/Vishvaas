from pydantic import BaseModel
from typing import List, Optional

class ExtractedData(BaseModel):
    company_name: str = ""
    hr_email: str = ""
    salary: str = ""
    role: str = ""
    website: str = ""

class VerifiedLinks(BaseModel):
    website: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None

class IPQSFraudIntel(BaseModel):
    fraud_score: int = 0
    is_disposable: bool = False
    recent_abuse: bool = False

class LinkedInJobsIntel(BaseModel):
    has_active_listings: bool = False
    message: str = ""

class AnalyzeResponse(BaseModel):
    score: int
    risk_level: str
    extracted_data: ExtractedData
    reasons: List[str]
    raw_text: str = ""
    llm_analysis: str = ""
    verified_links: Optional[VerifiedLinks] = None
    ipqs_intel: Optional[IPQSFraudIntel] = None
    linkedin_jobs: Optional[LinkedInJobsIntel] = None
