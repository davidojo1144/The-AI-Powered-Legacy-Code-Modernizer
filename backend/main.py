from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
import asyncio
from datetime import datetime
import json

app = FastAPI(
    title="Legacy Code Modernizer API",
    description="AI-powered legacy code analysis and modernization tool",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AnalysisRequest(BaseModel):
    project_name: str
    description: Optional[str] = None
    target_platform: str = "cloud"
    analysis_depth: str = "comprehensive"

class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str
    message: str
    created_at: datetime

class AnalysisResult(BaseModel):
    analysis_id: str
    project_name: str
    status: str
    findings: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    created_at: datetime
    completed_at: Optional[datetime] = None

# In-memory storage for now (will be replaced with PostgreSQL)
analysis_jobs = {}
analysis_results = {}

@app.get("/")
async def root():
    return {"message": "Legacy Code Modernizer API", "version": "1.0.0"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def create_analysis(
    project_name: str = Form(...),
    description: Optional[str] = Form(None),
    target_platform: str = Form("cloud"),
    analysis_depth: str = Form("comprehensive"),
    files: List[UploadFile] = File(...)
):
    """Create a new code analysis job"""
    try:
        analysis_id = str(uuid.uuid4())
        
        # Save uploaded files
        upload_dir = f"uploads/{analysis_id}"
        os.makedirs(upload_dir, exist_ok=True)
        
        uploaded_files = []
        for file in files:
            file_path = os.path.join(upload_dir, file.filename)
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            uploaded_files.append(file_path)
        
        # Create analysis job
        analysis_job = {
            "analysis_id": analysis_id,
            "project_name": project_name,
            "description": description,
            "target_platform": target_platform,
            "analysis_depth": analysis_depth,
            "uploaded_files": uploaded_files,
            "status": "pending",
            "created_at": datetime.now(),
            "progress": 0
        }
        
        analysis_jobs[analysis_id] = analysis_job
        
        # Start analysis in background
        asyncio.create_task(process_analysis(analysis_id))
        
        return AnalysisResponse(
            analysis_id=analysis_id,
            status="pending",
            message="Analysis job created successfully",
            created_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analysis/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_result(analysis_id: str):
    """Get analysis results"""
    if analysis_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_results[analysis_id]

@app.get("/api/analysis/{analysis_id}/status")
async def get_analysis_status(analysis_id: str):
    """Get analysis status"""
    if analysis_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    
    job = analysis_jobs[analysis_id]
    return {
        "analysis_id": analysis_id,
        "status": job["status"],
        "progress": job.get("progress", 0),
        "created_at": job["created_at"]
    }

async def process_analysis(analysis_id: str):
    """Process the analysis job"""
    job = analysis_jobs[analysis_id]
    job["status"] = "processing"
    
    try:
        # Simulate analysis progress
        for progress in [25, 50, 75, 100]:
            await asyncio.sleep(2)
            job["progress"] = progress
            
            if progress == 25:
                job["status"] = "scanning_code"
            elif progress == 50:
                job["status"] = "analyzing_dependencies"
            elif progress == 75:
                job["status"] = "generating_recommendations"
        
        # Generate mock results (will be replaced with actual AI analysis)
        findings = {
            "total_files": 15,
            "lines_of_code": 12500,
            "languages": ["Java", "JavaScript", "SQL"],
            "frameworks": ["Spring Boot", "React", "jQuery"],
            "deprecated_libraries": ["jQuery 1.x", "Java 8", "Spring Boot 1.5"],
            "security_vulnerabilities": 3,
            "code_smells": 28,
            "technical_debt_score": 7.2
        }
        
        recommendations = [
            {
                "type": "framework_upgrade",
                "priority": "high",
                "title": "Upgrade Spring Boot to 3.x",
                "description": "Current Spring Boot 1.5 is deprecated and has security vulnerabilities",
                "estimated_effort": "2-3 weeks",
                "benefits": ["Security improvements", "Better performance", "Cloud-native features"]
            },
            {
                "type": "cloud_migration",
                "priority": "high",
                "title": "Containerize application with Docker",
                "description": "Package application for cloud deployment",
                "estimated_effort": "1-2 weeks",
                "benefits": ["Scalability", "Consistent deployments", "Cloud portability"]
            },
            {
                "type": "code_quality",
                "priority": "medium",
                "title": "Refactor monolithic components",
                "description": "Break down large components into smaller, testable units",
                "estimated_effort": "3-4 weeks",
                "benefits": ["Better maintainability", "Improved testability", "Reduced complexity"]
            }
        ]
        
        result = AnalysisResult(
            analysis_id=analysis_id,
            project_name=job["project_name"],
            status="completed",
            findings=findings,
            recommendations=recommendations,
            created_at=job["created_at"],
            completed_at=datetime.now()
        )
        
        analysis_results[analysis_id] = result
        job["status"] = "completed"
        
    except Exception as e:
        job["status"] = "failed"
        job["error"] = str(e)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)