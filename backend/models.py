from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_name = Column(String, nullable=False)
    description = Column(Text)
    target_platform = Column(String, default="cloud")
    analysis_depth = Column(String, default="comprehensive")
    status = Column(String, default="pending")  # pending, processing, completed, failed
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    error_message = Column(Text)
    
    # Relationships
    files = relationship("AnalysisFile", back_populates="analysis", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="analysis", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")

class AnalysisFile(Base):
    __tablename__ = "analysis_files"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_size = Column(Integer)
    language = Column(String)  # java, javascript, python, etc.
    lines_of_code = Column(Integer)
    upload_status = Column(String, default="pending")  # pending, processed, failed
    processed_at = Column(DateTime)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="files")

class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    finding_type = Column(String, nullable=False)  # security, performance, maintainability, etc.
    severity = Column(String, nullable=False)  # critical, high, medium, low
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)  # file:line or file:range
    code_snippet = Column(Text)
    suggested_fix = Column(Text)
    confidence = Column(Integer)  # 0-100
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="findings")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    recommendation_type = Column(String, nullable=False)  # framework_upgrade, cloud_migration, code_quality, etc.
    priority = Column(String, nullable=False)  # high, medium, low
    title = Column(String, nullable=False)
    description = Column(Text)
    estimated_effort = Column(String)  # 1-2 weeks, 3-4 weeks, etc.
    benefits = Column(JSON)  # List of benefits
    implementation_steps = Column(JSON)  # List of steps
    code_changes = Column(JSON)  # Before/after code examples
    resources = Column(JSON)  # Links to documentation, tutorials
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="recommendations")

class Dependency(Base):
    __tablename__ = "dependencies"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    name = Column(String, nullable=False)
    version = Column(String)
    type = Column(String)  # framework, library, database, etc.
    status = Column(String)  # current, deprecated, vulnerable, outdated
    severity = Column(String)  # critical, high, medium, low
    latest_version = Column(String)
    release_date = Column(DateTime)
    end_of_life_date = Column(DateTime)
    vulnerability_count = Column(Integer, default=0)
    migration_complexity = Column(String)  # simple, moderate, complex
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("Analysis")

class CodeMetric(Base):
    __tablename__ = "code_metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    metric_type = Column(String, nullable=False)  # complexity, maintainability, test_coverage, etc.
    value = Column(String, nullable=False)
    score = Column(Integer)  # 0-100
    benchmark = Column(String)  # industry standard comparison
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("Analysis")

# Database connection utilities
def create_database_engine(database_url: str):
    """Create database engine"""
    return create_engine(database_url)

def create_session_local(engine):
    """Create session local"""
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables(engine):
    """Create all tables"""
    Base.metadata.create_all(bind=engine)

def get_db(session_local):
    """Get database session"""
    db = session_local()
    try:
        yield db
    finally:
        db.close()