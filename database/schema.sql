-- PostgreSQL Schema for Legacy Code Modernizer
-- Database: legacy_code_modernizer

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create tables
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_platform VARCHAR(50) DEFAULT 'cloud',
    analysis_depth VARCHAR(50) DEFAULT 'comprehensive',
    status VARCHAR(50) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);

CREATE TABLE analysis_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    file_size INTEGER,
    language VARCHAR(50),
    lines_of_code INTEGER,
    upload_status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    finding_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    code_snippet TEXT,
    suggested_fix TEXT,
    confidence INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_effort VARCHAR(100),
    benefits JSONB,
    implementation_steps JSONB,
    code_changes JSONB,
    resources JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    type VARCHAR(100),
    status VARCHAR(50),
    severity VARCHAR(20),
    latest_version VARCHAR(100),
    release_date TIMESTAMP,
    end_of_life_date TIMESTAMP,
    vulnerability_count INTEGER DEFAULT 0,
    migration_complexity VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE code_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    score INTEGER,
    benchmark VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
CREATE INDEX idx_analysis_files_analysis_id ON analysis_files(analysis_id);
CREATE INDEX idx_analysis_files_language ON analysis_files(language);
CREATE INDEX idx_findings_analysis_id ON findings(analysis_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_type ON findings(finding_type);
CREATE INDEX idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX idx_recommendations_priority ON recommendations(priority);
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);
CREATE INDEX idx_dependencies_analysis_id ON dependencies(analysis_id);
CREATE INDEX idx_dependencies_status ON dependencies(status);
CREATE INDEX idx_code_metrics_analysis_id ON code_metrics(analysis_id);
CREATE INDEX idx_code_metrics_type ON code_metrics(metric_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for analyses table
CREATE TRIGGER update_analyses_updated_at 
    BEFORE UPDATE ON analyses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for analysis summary
CREATE VIEW analysis_summary AS
SELECT 
    a.id,
    a.project_name,
    a.description,
    a.target_platform,
    a.analysis_depth,
    a.status,
    a.progress,
    a.created_at,
    a.completed_at,
    COUNT(DISTINCT af.id) as file_count,
    COUNT(DISTINCT f.id) as finding_count,
    COUNT(DISTINCT r.id) as recommendation_count,
    COUNT(DISTINCT d.id) as dependency_count
FROM analyses a
LEFT JOIN analysis_files af ON a.id = af.analysis_id
LEFT JOIN findings f ON a.id = f.analysis_id
LEFT JOIN recommendations r ON a.id = r.analysis_id
LEFT JOIN dependencies d ON a.id = d.analysis_id
GROUP BY a.id, a.project_name, a.description, a.target_platform, a.analysis_depth, a.status, a.progress, a.created_at, a.completed_at;

-- Create view for critical findings
CREATE VIEW critical_findings AS
SELECT 
    f.id,
    f.analysis_id,
    f.finding_type,
    f.severity,
    f.title,
    f.description,
    f.location,
    f.created_at,
    a.project_name
FROM findings f
JOIN analyses a ON f.analysis_id = a.id
WHERE f.severity IN ('critical', 'high')
ORDER BY f.created_at DESC;

-- Create view for high priority recommendations
CREATE VIEW high_priority_recommendations AS
SELECT 
    r.id,
    r.analysis_id,
    r.recommendation_type,
    r.priority,
    r.title,
    r.description,
    r.estimated_effort,
    r.created_at,
    a.project_name
FROM recommendations r
JOIN analyses a ON r.analysis_id = a.id
WHERE r.priority = 'high'
ORDER BY r.created_at DESC;

-- Insert sample data for testing
INSERT INTO analyses (project_name, description, target_platform, analysis_depth, status, progress) VALUES
('Legacy Banking System', 'Core banking application from 2015', 'cloud', 'comprehensive', 'completed', 100),
('E-commerce Platform', 'Online retail platform using old frameworks', 'kubernetes', 'standard', 'processing', 75),
('HR Management System', 'Employee management system with COBOL components', 'cloud', 'comprehensive', 'pending', 0);

-- Insert sample findings
INSERT INTO findings (analysis_id, finding_type, severity, title, description, location, confidence) VALUES
((SELECT id FROM analyses WHERE project_name = 'Legacy Banking System'), 'security', 'critical', 'SQL Injection Vulnerability', 'User input is not properly sanitized before database queries', 'src/main/java/UserDAO.java:45', 95),
((SELECT id FROM analyses WHERE project_name = 'Legacy Banking System'), 'performance', 'high', 'N+1 Query Problem', 'Multiple database queries in a loop causing performance issues', 'src/main/java/AccountService.java:123', 88),
((SELECT id FROM analyses WHERE project_name = 'E-commerce Platform'), 'maintainability', 'medium', 'Long Method', 'Method exceeds 100 lines of code', 'src/components/ProductList.js:15', 75);

-- Insert sample recommendations
INSERT INTO recommendations (analysis_id, recommendation_type, priority, title, description, estimated_effort, benefits) VALUES
((SELECT id FROM analyses WHERE project_name = 'Legacy Banking System'), 'framework_upgrade', 'high', 'Upgrade Spring Boot to 3.x', 'Current Spring Boot 1.5 is deprecated and has security vulnerabilities', '2-3 weeks', '["Security improvements", "Better performance", "Cloud-native features"]'),
((SELECT id FROM analyses WHERE project_name = 'Legacy Banking System'), 'cloud_migration', 'high', 'Containerize application with Docker', 'Package application for cloud deployment', '1-2 weeks', '["Scalability", "Consistent deployments", "Cloud portability"]'),
((SELECT id FROM analyses WHERE project_name = 'E-commerce Platform'), 'code_quality', 'medium', 'Refactor monolithic components', 'Break down large components into smaller, testable units', '3-4 weeks', '["Better maintainability", "Improved testability", "Reduced complexity"]');