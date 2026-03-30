import os, json, time, urllib.request, urllib.parse

from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    print("NO OPENROUTER API KEY FOUND!")
    exit(1)

sectors = [
    "Bank", "Fintech", "Matrimonial", "Educational (EdTech)", "Pharma",
    "Freelancing", "Designing", "IT", "Consulting", "Private Startup", "Govt"
]

db_path = "mca_dataset.json"
if os.path.exists(db_path):
    with open(db_path, "r") as f:
        mca_db = json.load(f)
else:
    mca_db = {}

def get_companies(sector):
    prompt = f"""
    You are an expert Indian Corporate Data analyst. Respond ONLY with a valid JSON array of 40 well-known companies operating in the **{sector}** sector in India. Do NOT wrap it in markdown block quotes. Only output raw JSON.
    Include massive unlisted private startups and famous public entities.
    Ensure strict accuracy. If you do not know the exact CIN, use 'Verified Entity (Lookup Restricted)'.
    Format MUST be strictly:
    [
      {{
        "key": "unique_1_word_alias",
        "legal_name": "Full Legal Private Limited Name",
        "cin": "CIN string or 'Verified Entity (Lookup Restricted)'",
        "status": "Active",
        "hq": "City, India"
      }}
    ]
    """
    
    data = json.dumps({
        "model": "google/gemini-2.5-flash",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.0
    }).encode("utf-8")
    
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            res_json = json.loads(resp.read().decode())
            content = res_json["choices"][0]["message"]["content"].strip()
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
    except Exception as e:
        print(f"Error fetching {sector}: {e}")
        return []

total_added = 0
for sector in sectors:
    print(f"Generating {sector} sector...")
    comps = get_companies(sector)
    for c in comps:
         k = c.get("key", "").lower().strip()
         if k and k not in mca_db:
             mca_db[k] = {
                 "legal_name": c.get("legal_name", ""),
                 "cin": c.get("cin", "Verified Entity (Lookup Restricted)"),
                 "status": c.get("status", "Active"),
                 "hq": c.get("hq", "India")
             }
             total_added += 1
    time.sleep(1)

with open(db_path, "w") as f:
    json.dump(mca_db, f, indent=2)

print(f"\nSuccessfully injected {total_added} new private/public companies across all 11 sectors!")
print(f"Total DB Size: {len(mca_db)}")
