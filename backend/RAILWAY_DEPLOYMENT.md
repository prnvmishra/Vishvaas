# VISHWAS Railway Deployment Guide

## 🚀 Full Production Deployment

### Features Included:
- ✅ Full PDF processing (PyMuPDF, pdfplumber, PyPDF2)
- ✅ OCR for images (Tesseract + OpenCV)
- ✅ AI analysis (OpenRouter + OpenAI)
- ✅ NLP processing (spaCy)
- ✅ Web search (Google + DuckDuckGo)
- ✅ Wikipedia integration
- ✅ All dependencies working

## 📋 Files Created:
- `requirements.txt` - Full production dependencies
- `Dockerfile.production` - Railway Docker setup
- `main-production.py` - Unified production API
- `railway.toml` - Railway configuration

## 🛠️ Deployment Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Railway production deployment"
git push origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Connect GitHub repository
4. Select backend folder
5. Use `Dockerfile.production`
6. Set environment variables

### 3. Environment Variables Required:
```
OPENROUTER_API_KEY=your_openrouter_key
DATABASE_URL=your_database_url
IPQS_API_KEY=your_ipqs_key
RAPIDAPI_KEY=your_rapidapi_key
```

### 4. Railway Configuration:
- **Build Command**: `docker build -f Dockerfile.production .`
- **Start Command**: `uvicorn main-production:app --host 0.0.0.0 --port $PORT`
- **Port**: 8000

## 🔧 What's Working:

### Document Processing:
- PDF files: 3 extraction methods
- Image files: OCR with Tesseract
- Text files: Direct reading
- Fallback: Smart error handling

### AI Features:
- OpenRouter integration
- GPT analysis
- Smart risk scoring
- Entity extraction

### Web Features:
- Google search
- DuckDuckGo search
- Wikipedia data
- Company verification

### NLP Features:
- spaCy entity extraction
- Named entity recognition
- Pattern matching

## 📊 Expected Performance:
- **Memory**: ~1GB (Railway can handle)
- **Build time**: 3-5 minutes
- **Processing**: Fast with all optimizations
- **Cost**: ~$5-20/month on Railway

## 🎯 Testing After Deployment:
```bash
# Test health
curl https://your-app.railway.app/

# Test document analysis
curl -X POST https://your-app.railway.app/analyze \
  -F "file=@your-document.pdf"

# Test company search
curl https://your-app.railway.app/company/google
```

## 🔄 Monitoring:
- Railway logs for debugging
- Health checks every 30s
- Auto-restart on failure
- Performance metrics

## 💰 Cost Estimate:
- Railway: $5-20/month
- OpenRouter: $1-5/month (based on usage)
- Total: ~$10-25/month

## 🎉 Ready for Production!
All dependencies working, full features enabled, optimized for Railway hosting.
