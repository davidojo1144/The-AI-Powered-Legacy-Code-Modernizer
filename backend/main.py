from fastapi import FastAPI, HTTPException, Depends, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import asyncio
from datetime import datetime
import json
import os
import tempfile
from pathlib import Path

# LangChain imports
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain.schema import BaseMessage, HumanMessage, AIMessage
from langchain.tools import Tool, StructuredTool
from langchain.callbacks.manager import CallbackManager

# Tree-sitter imports
import tree_sitter
import tree_sitter_java
import tree_sitter_javascript
import tree_sitter_python
import tree_sitter_c_sharp

# Database models
from models import (
    Analysis, AnalysisFile, Finding, Recommendation, Dependency, CodeMetric,
    create_database_engine, create_session_local, create_tables, get_db
)
from sqlalchemy.orm import Session

app = FastAPI(
    title="Legacy Code Modernizer API",
    description="AI-powered legacy code analysis and modernization tool",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/legacy_code_modernizer")
engine = create_database_engine(DATABASE_URL)
SessionLocal = create_session_local(engine)

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables(engine)

# Dependency to get DB session
def get_database():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class AnalysisRequest(BaseModel):
    project_name: str
    description: Optional[str] = None
    target_platform: str = "cloud"
    analysis_depth: str = "comprehensive"

class AnalysisResponse(BaseModel):
    id: str
    project_name: str
    description: Optional[str]
    target_platform: str
    analysis_depth: str
    status: str
    progress: int
    created_at: datetime
    findings: List[Dict[str, Any]] = []
    recommendations: List[Dict[str, Any]] = []

class CodeAnalysisTool:
    """Tree-sitter based code analysis tool"""
    
    def __init__(self):
        self.language_parsers = {
            'java': tree_sitter_java.language(),
            'javascript': tree_sitter_javascript.language(),
            'python': tree_sitter_python.language(),
            'csharp': tree_sitter_c_sharp.language(),
        }
    
    def detect_language(self, filename: str, content: str) -> str:
        """Detect programming language from filename and content"""
        extension = Path(filename).suffix.lower()
        
        language_map = {
            '.java': 'java',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'javascript',
            '.tsx': 'javascript',
            '.py': 'python',
            '.cs': 'csharp',
            '.cobol': 'cobol',
            '.cbl': 'cobol',
            '.cob': 'cobol',
        }
        
        return language_map.get(extension, 'unknown')
    
    def parse_code(self, filename: str, content: str) -> Dict[str, Any]:
        """Parse code using tree-sitter and extract information"""
        language = self.detect_language(filename, content)
        
        if language == 'unknown':
            return {
                'language': 'unknown',
                'functions': [],
                'classes': [],
                'imports': [],
                'complexity': 0,
                'lines_of_code': len(content.split('\n'))
            }
        
        try:
            parser = tree_sitter.Parser()
            parser.set_language(self.language_parsers.get(language, self.language_parsers['java']))
            
            tree = parser.parse(bytes(content, 'utf8'))
            root_node = tree.root_node
            
            analysis = {
                'language': language,
                'functions': self._extract_functions(root_node, language),
                'classes': self._extract_classes(root_node, language),
                'imports': self._extract_imports(root_node, language),
                'complexity': self._calculate_complexity(root_node),
                'lines_of_code': len(content.split('\n'))
            }
            
            return analysis
            
        except Exception as e:
            return {
                'language': language,
                'functions': [],
                'classes': [],
                'imports': [],
                'complexity': 0,
                'lines_of_code': len(content.split('\n')),
                'error': str(e)
            }
    
    def _extract_functions(self, node: tree_sitter.Node, language: str) -> List[Dict[str, Any]]:
        """Extract function/method information"""
        functions = []
        
        if language == 'java':
            for child in node.children:
                if child.type == 'method_declaration':
                    method_name = self._get_node_text(child, 'identifier')
                    functions.append({
                        'name': method_name,
                        'type': 'method',
                        'parameters': self._get_method_parameters(child),
                        'start_line': child.start_point[0],
                        'end_line': child.end_point[0]
                    })
        elif language == 'python':
            for child in node.children:
                if child.type == 'function_definition':
                    func_name = self._get_node_text(child, 'identifier')
                    functions.append({
                        'name': func_name,
                        'type': 'function',
                        'parameters': self._get_function_parameters(child),
                        'start_line': child.start_point[0],
                        'end_line': child.end_point[0]
                    })
        
        return functions
    
    def _extract_classes(self, node: tree_sitter.Node, language: str) -> List[Dict[str, Any]]:
        """Extract class information"""
        classes = []
        
        if language == 'java':
            for child in node.children:
                if child.type == 'class_declaration':
                    class_name = self._get_node_text(child, 'identifier')
                    classes.append({
                        'name': class_name,
                        'type': 'class',
                        'start_line': child.start_point[0],
                        'end_line': child.end_point[0]
                    })
        elif language == 'python':
            for child in node.children:
                if child.type == 'class_definition':
                    class_name = self._get_node_text(child, 'identifier')
                    classes.append({
                        'name': class_name,
                        'type': 'class',
                        'start_line': child.start_point[0],
                        'end_line': child.end_point[0]
                    })
        
        return classes
    
    def _extract_imports(self, node: tree_sitter.Node, language: str) -> List[str]:
        """Extract import statements"""
        imports = []
        
        if language == 'java':
            for child in node.children:
                if child.type == 'import_declaration':
                    import_text = self._get_node_text(child)
                    imports.append(import_text)
        elif language == 'python':
            for child in node.children:
                if child.type == 'import_statement' or child.type == 'import_from_statement':
                    import_text = self._get_node_text(child)
                    imports.append(import_text)
        
        return imports
    
    def _calculate_complexity(self, node: tree_sitter.Node) -> int:
        """Calculate cyclomatic complexity"""
        complexity = 1
        
        # Count decision points
        decision_types = ['if_statement', 'while_statement', 'for_statement', 'case_statement', 'catch_clause']
        
        def count_decisions(node: tree_sitter.Node):
            nonlocal complexity
            if node.type in decision_types:
                complexity += 1
            for child in node.children:
                count_decisions(child)
        
        count_decisions(node)
        return complexity
    
    def _get_node_text(self, node: tree_sitter.Node, node_type: str = None) -> str:
        """Extract text from a specific node"""
        if node_type:
            for child in node.children:
                if child.type == node_type:
                    return child.text.decode('utf-8')
        return node.text.decode('utf-8') if node.text else ''
    
    def _get_method_parameters(self, node: tree_sitter.Node) -> List[str]:
        """Extract method parameters"""
        params = []
        for child in node.children:
            if child.type == 'formal_parameters':
                return [param.text.decode('utf-8') for param in child.children if param.type == 'formal_parameter']
        return params
    
    def _get_function_parameters(self, node: tree_sitter.Node) -> List[str]:
        """Extract function parameters"""
        params = []
        for child in node.children:
            if child.type == 'parameters':
                return [param.text.decode('utf-8') for param in child.children if param.type == 'identifier']
        return params

# LangChain Agent Tools
def create_analysis_tools(code_analyzer: CodeAnalysisTool) -> List[Tool]:
    """Create LangChain tools for code analysis"""
    
    scanner_tool = Tool(
        name="code_scanner",
        func=lambda code_info: scan_code_for_issues(code_info),
        description="Scan code for security vulnerabilities, deprecated libraries, and code smells"
    )
    
    dependency_tool = Tool(
        name="dependency_mapper",
        func=lambda code_info: analyze_dependencies(code_info),
        description="Analyze code dependencies and identify outdated or vulnerable libraries"
    )
    
    cloud_readiness_tool = Tool(
        name="cloud_readiness_analyzer",
        func=lambda code_info: analyze_cloud_readiness(code_info),
        description="Analyze code for cloud migration readiness and suggest cloud-native patterns"
    )
    
    return [scanner_tool, dependency_tool, cloud_readiness_tool]

def scan_code_for_issues(code_info: Dict[str, Any]) -> str:
    """Scan code for issues using AI"""
    # This would integrate with Ollama for actual AI analysis
    # For now, return mock results
    findings = []
    
    # Mock security issues
    if 'sql' in str(code_info).lower():
        findings.append("Potential SQL injection vulnerability detected")
    
    # Mock performance issues
    if 'for' in str(code_info).lower() and 'database' in str(code_info).lower():
        findings.append("Possible N+1 query problem")
    
    # Mock maintainability issues
    if code_info.get('lines_of_code', 0) > 100:
        findings.append("Large file size may affect maintainability")
    
    return json.dumps({
        "findings": findings,
        "severity": "medium" if findings else "low",
        "recommendations": ["Review database queries", "Consider refactoring large files"]
    })

def analyze_dependencies(code_info: Dict[str, Any]) -> str:
    """Analyze code dependencies"""
    imports = code_info.get('imports', [])
    
    # Mock dependency analysis
    outdated_deps = []
    vulnerable_deps = []
    
    for import_stmt in imports:
        if 'spring' in import_stmt.lower() and '1.5' in import_stmt.lower():
            outdated_deps.append("Spring Boot 1.5 (deprecated)")
        if 'log4j' in import_stmt.lower():
            vulnerable_deps.append("Log4j (security vulnerability)")
    
    return json.dumps({
        "outdated_dependencies": outdated_deps,
        "vulnerable_dependencies": vulnerable_deps,
        "recommendations": ["Upgrade Spring Boot to 3.x", "Replace Log4j with Logback"]
    })

def analyze_cloud_readiness(code_info: Dict[str, Any]) -> str:
    """Analyze cloud readiness"""
    # Mock cloud readiness analysis
    cloud_issues = []
    recommendations = []
    
    # Check for stateful patterns
    if 'session' in str(code_info).lower():
        cloud_issues.append("Stateful session management detected")
        recommendations.append("Consider external session storage for scalability")
    
    # Check for hardcoded configurations
    if 'localhost' in str(code_info).lower() or '127.0.0.1' in str(code_info).lower():
        cloud_issues.append("Hardcoded local configurations found")
        recommendations.append("Use environment variables for configuration")
    
    return json.dumps({
        "cloud_readiness_score": 75 if not cloud_issues else 50,
        "issues": cloud_issues,
        "recommendations": recommendations,
        "suggested_patterns": ["12-Factor App", "Microservices", "Containerization"]
    })

# Multi-Agent System
class AnalysisAgent:
    """Multi-agent system for code analysis"""
    
    def __init__(self):
        self.code_analyzer = CodeAnalysisTool()
        self.tools = create_analysis_tools(self.code_analyzer)
    
    async def analyze_code(self, analysis_id: str, files: List[Dict[str, Any]], db: Session) -> Dict[str, Any]:
        """Analyze code using multi-agent system"""
        
        all_findings = []
        all_recommendations = []
        all_dependencies = []
        
        for file_info in files:
            try:
                # Parse code using tree-sitter
                code_analysis = self.code_analyzer.parse_code(
                    file_info['filename'], 
                    file_info['content']
                )
                
                # Run multi-agent analysis
                scanner_results = json.loads(scan_code_for_issues(code_analysis))
                dependency_results = json.loads(analyze_dependencies(code_analysis))
                cloud_results = json.loads(analyze_cloud_readiness(code_analysis))
                
                # Create findings
                for finding in scanner_results.get('findings', []):
                    db_finding = Finding(
                        analysis_id=analysis_id,
                        finding_type='security',
                        severity=scanner_results.get('severity', 'medium'),
                        title=finding,
                        description=finding,
                        location=f"{file_info['filename']}:1",
                        confidence=80
                    )
                    db.add(db_finding)
                    all_findings.append({
                        'type': 'security',
                        'severity': scanner_results.get('severity', 'medium'),
                        'title': finding,
                        'file': file_info['filename']
                    })
                
                # Create recommendations
                for rec in scanner_results.get('recommendations', []):
                    db_rec = Recommendation(
                        analysis_id=analysis_id,
                        recommendation_type='code_quality',
                        priority='high',
                        title=rec,
                        description=rec,
                        estimated_effort='1-2 weeks',
                        benefits=['Improved security', 'Better performance'],
                        implementation_steps=[rec],
                        code_changes={}
                    )
                    db.add(db_rec)
                    all_recommendations.append({
                        'type': 'code_quality',
                        'priority': 'high',
                        'title': rec,
                        'file': file_info['filename']
                    })
                
                # Process dependencies
                for dep in dependency_results.get('outdated_dependencies', []):
                    db_dep = Dependency(
                        analysis_id=analysis_id,
                        name=dep,
                        type='library',
                        status='outdated',
                        severity='medium',
                        migration_complexity='moderate'
                    )
                    db.add(db_dep)
                    all_dependencies.append(dep)
                
                # Update file processing status
                db_file = db.query(AnalysisFile).filter(
                    AnalysisFile.analysis_id == analysis_id,
                    AnalysisFile.filename == file_info['filename']
                ).first()
                
                if db_file:
                    db_file.processed_at = datetime.utcnow()
                    db_file.upload_status = 'processed'
                
            except Exception as e:
                print(f"Error analyzing file {file_info['filename']}: {str(e)}")
                continue
        
        db.commit()
        
        return {
            'findings': all_findings,
            'recommendations': all_recommendations,
            'dependencies': all_dependencies,
            'files_analyzed': len(files)
        }

# Initialize analysis agent
analysis_agent = AnalysisAgent()

# API Endpoints
@app.post("/api/analyze", response_model=AnalysisResponse)
async def create_analysis(
    project_name: str = Form(...),
    description: Optional[str] = Form(None),
    target_platform: str = Form("cloud"),
    analysis_depth: str = Form("comprehensive"),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_database)
):
    """Create a new analysis job"""
    
    # Create analysis record
    analysis_id = str(uuid.uuid4())
    analysis = Analysis(
        id=analysis_id,
        project_name=project_name,
        description=description,
        target_platform=target_platform,
        analysis_depth=analysis_depth,
        status="processing",
        progress=0
    )
    db.add(analysis)
    db.commit()
    
    # Process uploaded files
    processed_files = []
    for file in files:
        try:
            content = await file.read()
            content_str = content.decode('utf-8')
            
            # Create file record
            analysis_file = AnalysisFile(
                analysis_id=analysis_id,
                filename=file.filename,
                filepath=f"uploads/{analysis_id}/{file.filename}",
                file_size=len(content),
                upload_status="uploaded"
            )
            db.add(analysis_file)
            
            processed_files.append({
                'filename': file.filename,
                'content': content_str,
                'size': len(content)
            })
            
        except Exception as e:
            print(f"Error processing file {file.filename}: {str(e)}")
            continue
    
    db.commit()
    
    # Start background analysis
    asyncio.create_task(run_analysis(analysis_id, processed_files, db))
    
    return AnalysisResponse(
        id=analysis_id,
        project_name=project_name,
        description=description,
        target_platform=target_platform,
        analysis_depth=analysis_depth,
        status="processing",
        progress=10,
        created_at=datetime.utcnow()
    )

async def run_analysis(analysis_id: str, files: List[Dict[str, Any]], db: Session):
    """Run analysis in background"""
    try:
        # Update progress
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if analysis:
            analysis.progress = 25
            db.commit()
        
        # Run multi-agent analysis
        results = await analysis_agent.analyze_code(analysis_id, files, db)
        
        # Update analysis status
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if analysis:
            analysis.status = "completed"
            analysis.progress = 100
            analysis.completed_at = datetime.utcnow()
            db.commit()
        
        print(f"Analysis {analysis_id} completed successfully")
        
    except Exception as e:
        print(f"Error in analysis {analysis_id}: {str(e)}")
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if analysis:
            analysis.status = "failed"
            analysis.error_message = str(e)
            db.commit()

@app.get("/api/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str, db: Session = Depends(get_database)):
    """Get analysis results"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Get findings and recommendations
    findings = db.query(Finding).filter(Finding.analysis_id == analysis_id).all()
    recommendations = db.query(Recommendation).filter(Recommendation.analysis_id == analysis_id).all()
    
    return AnalysisResponse(
        id=analysis.id,
        project_name=analysis.project_name,
        description=analysis.description,
        target_platform=analysis.target_platform,
        analysis_depth=analysis.analysis_depth,
        status=analysis.status,
        progress=analysis.progress,
        created_at=analysis.created_at,
        findings=[
            {
                'id': f.id,
                'type': f.finding_type,
                'severity': f.severity,
                'title': f.title,
                'description': f.description,
                'location': f.location
            } for f in findings
        ],
        recommendations=[
            {
                'id': r.id,
                'type': r.recommendation_type,
                'priority': r.priority,
                'title': r.title,
                'description': r.description,
                'estimated_effort': r.estimated_effort
            } for r in recommendations
        ]
    )

@app.get("/api/analyses")
async def list_analyses(db: Session = Depends(get_database)):
    """List all analyses"""
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).limit(50).all()
    
    return [
        {
            'id': a.id,
            'project_name': a.project_name,
            'description': a.description,
            'target_platform': a.target_platform,
            'analysis_depth': a.analysis_depth,
            'status': a.status,
            'progress': a.progress,
            'created_at': a.created_at,
            'completed_at': a.completed_at
        } for a in analyses
    ]

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)