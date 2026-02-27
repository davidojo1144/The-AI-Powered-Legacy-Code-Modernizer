'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  ProgressBar, 
  Badge, 
  Modal, 
  FileUpload, 
  CodeEditor, 
  DiffViewer, 
  Chart, 
  Sidebar, 
  Navigation 
} from '@/components';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Cloud, 
  Code, 
  Zap, 
  Settings, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  projectName: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  findings: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    lineNumber?: number;
    file?: string;
    recommendation?: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    estimatedEffort: string;
    complexity: 'simple' | 'moderate' | 'complex';
    originalCode?: string;
    suggestedCode?: string;
  }>;
  metrics: {
    totalFiles: number;
    linesOfCode: number;
    complexity: number;
    dependencies: number;
    cloudReadiness: number;
  };
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AnalysisResult['recommendations'][0] | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([
    {
      id: '1',
      projectName: 'Legacy Banking System',
      description: 'Core banking application modernization assessment',
      status: 'completed',
      progress: 100,
      findings: [
        {
          id: 'f1',
          type: 'error',
          category: 'Security',
          description: 'Hardcoded database credentials in configuration files',
          severity: 'high',
          lineNumber: 45,
          file: 'config/database.properties',
          recommendation: 'Use environment variables or secure credential management'
        },
        {
          id: 'f2',
          type: 'warning',
          category: 'Performance',
          description: 'Inefficient database queries detected',
          severity: 'medium',
          lineNumber: 123,
          file: 'src/AccountService.java',
          recommendation: 'Consider implementing query optimization and caching'
        }
      ],
      recommendations: [
        {
          id: 'r1',
          title: 'Containerize Application',
          description: 'Package the application in Docker containers for cloud deployment',
          priority: 'high',
          estimatedEffort: '2-3 weeks',
          complexity: 'moderate',
          originalCode: 'public class LegacyApp {\n  public static void main(String[] args) {\n    // Direct database connection\n    Connection conn = DriverManager.getConnection(\n      "jdbc:mysql://localhost:3306/banking", \n      "root", \n      "password123"\n    );\n  }\n}',
          suggestedCode: '@SpringBootApplication\npublic class ModernApp {\n  @Autowired\n  private DataSource dataSource;\n  \n  public static void main(String[] args) {\n    SpringApplication.run(ModernApp.class, args);\n  }\n}'
        }
      ],
      metrics: {
        totalFiles: 127,
        linesOfCode: 15420,
        complexity: 8.5,
        dependencies: 34,
        cloudReadiness: 65
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      projectName: 'E-commerce Platform',
      description: 'Online retail platform assessment',
      status: 'processing',
      progress: 75,
      findings: [],
      recommendations: [],
      metrics: {
        totalFiles: 0,
        linesOfCode: 0,
        complexity: 0,
        dependencies: 0,
        cloudReadiness: 0
      },
      createdAt: '2024-01-14T14:20:00Z'
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    targetPlatform: 'cloud',
    analysisDepth: 'comprehensive'
  });

  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const sidebarItems = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Dashboard',
      href: '#dashboard',
      active: currentPage === 'dashboard',
      onClick: () => setCurrentPage('dashboard')
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Analyses',
      href: '#analyses',
      active: currentPage === 'analyses',
      onClick: () => setCurrentPage('analyses')
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      label: 'Recommendations',
      href: '#recommendations',
      active: currentPage === 'recommendations',
      onClick: () => setCurrentPage('recommendations')
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      href: '#settings',
      active: currentPage === 'settings',
      onClick: () => setCurrentPage('settings')
    }
  ];

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleStartAnalysis = () => {
    if (!newProject.name.trim() || uploadedFiles.length === 0) {
      alert('Please enter a project name and upload files');
      return;
    }

    // Simulate analysis start
    const newAnalysis: AnalysisResult = {
      id: Date.now().toString(),
      projectName: newProject.name,
      description: newProject.description,
      status: 'processing',
      progress: 0,
      findings: [],
      recommendations: [],
      metrics: {
        totalFiles: uploadedFiles.length,
        linesOfCode: 0,
        complexity: 0,
        dependencies: 0,
        cloudReadiness: 0
      },
      createdAt: new Date().toISOString()
    };

    setAnalyses(prev => [newAnalysis, ...prev]);
    setShowNewAnalysisModal(false);
    setNewProject({ name: '', description: '', targetPlatform: 'cloud', analysisDepth: 'comprehensive' });
    setUploadedFiles([]);

    // Simulate progress
    setTimeout(() => {
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === newAnalysis.id 
          ? { ...analysis, progress: 25 }
          : analysis
      ));
    }, 1000);

    setTimeout(() => {
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === newAnalysis.id 
          ? { ...analysis, progress: 75 }
          : analysis
      ));
    }, 3000);

    setTimeout(() => {
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === newAnalysis.id 
          ? { 
              ...analysis, 
              progress: 100, 
              status: 'completed',
              findings: [
                {
                  id: 'f3',
                  type: 'warning',
                  category: 'Architecture',
                  description: 'Monolithic architecture detected',
                  severity: 'medium',
                  recommendation: 'Consider microservices architecture'
                }
              ],
              recommendations: [
                {
                  id: 'r2',
                  title: 'API Gateway Implementation',
                  description: 'Implement API gateway for microservices communication',
                  priority: 'high',
                  estimatedEffort: '3-4 weeks',
                  complexity: 'complex'
                }
              ],
              metrics: {
                totalFiles: uploadedFiles.length,
                linesOfCode: 8500,
                complexity: 6.2,
                dependencies: 18,
                cloudReadiness: 72
              }
            }
          : analysis
      ));
    }, 5000);
  };

  const viewRecommendation = (recommendation: AnalysisResult['recommendations'][0]) => {
    setSelectedRecommendation(recommendation);
    setShowDiffModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const chartData = [
    { label: 'Completed', value: analyses.filter(a => a.status === 'completed').length, color: 'bg-green-500' },
    { label: 'Processing', value: analyses.filter(a => a.status === 'processing').length, color: 'bg-blue-500' },
    { label: 'Failed', value: analyses.filter(a => a.status === 'failed').length, color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          items={sidebarItems}
          className="hidden md:block"
        />
        
        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Legacy Code Modernizer</h1>
              <p className="text-white/70">AI-powered legacy code analysis and modernization recommendations</p>
            </div>
            <Button
              onClick={() => setShowNewAnalysisModal(true)}
              leftIcon={<Upload className="w-5 h-5" />}
              className="hidden md:flex"
            >
              New Analysis
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Analyses</p>
                  <p className="text-2xl font-bold text-white">{analyses.length}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {analyses.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {analyses.filter(a => a.status === 'processing').length}
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Avg Readiness</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(analyses.filter(a => a.status === 'completed')
                      .reduce((acc, a) => acc + a.metrics.cloudReadiness, 0) / 
                      Math.max(analyses.filter(a => a.status === 'completed').length, 1))}%
                  </p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis Status</h3>
              <Chart data={chartData} type="pie" height={250} />
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Cloud Readiness Scores</h3>
              <Chart 
                data={analyses.filter(a => a.status === 'completed').map(a => ({
                  label: a.projectName.length > 15 ? a.projectName.substring(0, 15) + '...' : a.projectName,
                  value: a.metrics.cloudReadiness
                }))}
                type="bar"
                height={250}
              />
            </Card>
          </div>

          {/* Recent Analyses */}
          <Card className="bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Analyses</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('analyses')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {analyses.slice(0, 3).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{analysis.projectName}</h4>
                      <p className="text-white/70 text-sm">{analysis.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusColor(analysis.status)}>
                      {analysis.status}
                    </Badge>
                    
                    {analysis.status === 'processing' && (
                      <div className="w-32">
                        <ProgressBar value={analysis.progress} showPercentage />
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedAnalysis(analysis)}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected Analysis Details */}
          {selectedAnalysis && (
            <Card className="bg-white/5 backdrop-blur-sm mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedAnalysis.projectName} - Analysis Results
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAnalysis(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Findings */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Findings ({selectedAnalysis.findings.length})</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedAnalysis.findings.map((finding) => (
                      <Card key={finding.id} variant="highlighted" className="p-4">
                        <div className="flex items-start space-x-3">
                          <Badge variant={getSeverityColor(finding.severity)} size="sm">
                            {finding.severity}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-white font-medium">{finding.category}</p>
                            <p className="text-white/70 text-sm">{finding.description}</p>
                            {finding.recommendation && (
                              <p className="text-blue-300 text-sm mt-2">💡 {finding.recommendation}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Recommendations ({selectedAnalysis.recommendations.length})</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedAnalysis.recommendations.map((recommendation) => (
                      <Card key={recommendation.id} variant="default" className="p-4 hover:bg-white/10 cursor-pointer" 
                            onClick={() => viewRecommendation(recommendation)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">{recommendation.title}</p>
                            <p className="text-white/70 text-sm">{recommendation.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant={recommendation.priority === 'high' ? 'error' : 'warning'} size="sm">
                                {recommendation.priority} priority
                              </Badge>
                              <span className="text-white/60 text-xs">{recommendation.estimatedEffort}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            View Code
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Project Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-white/70 text-sm">Files</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.metrics.totalFiles}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-white/70 text-sm">Lines of Code</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.metrics.linesOfCode.toLocaleString()}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-white/70 text-sm">Complexity</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.metrics.complexity}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-white/70 text-sm">Dependencies</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.metrics.dependencies}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-white/70 text-sm">Cloud Readiness</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.metrics.cloudReadiness}%</p>
                  </Card>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* New Analysis Modal */}
      <Modal
        isOpen={showNewAnalysisModal}
        onClose={() => setShowNewAnalysisModal(false)}
        title="Start New Analysis"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Project Name *</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your project and modernization goals"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Target Platform</label>
              <select
                value={newProject.targetPlatform}
                onChange={(e) => setNewProject(prev => ({ ...prev, targetPlatform: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cloud">Cloud</option>
                <option value="kubernetes">Kubernetes</option>
                <option value="serverless">Serverless</option>
                <option value="microservices">Microservices</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Analysis Depth</label>
              <select
                value={newProject.analysisDepth}
                onChange={(e) => setNewProject(prev => ({ ...prev, analysisDepth: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="quick">Quick</option>
                <option value="standard">Standard</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Upload Files</label>
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".java,.js,.py,.cs,.cobol,.txt"
              multiple
              dragText="Drag and drop your legacy code files here"
              buttonText="Select Files"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowNewAnalysisModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartAnalysis}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Start Analysis
            </Button>
          </div>
        </div>
      </Modal>

      {/* Diff Viewer Modal */}
      <Modal
        isOpen={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        title="Code Recommendation"
        size="xl"
      >
        {selectedRecommendation && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">{selectedRecommendation.title}</h4>
              <p className="text-white/70">{selectedRecommendation.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={selectedRecommendation.priority === 'high' ? 'error' : 'warning'}>
                  {selectedRecommendation.priority} priority
                </Badge>
                <span className="text-white/60 text-sm">{selectedRecommendation.estimatedEffort}</span>
                <span className="text-white/60 text-sm">{selectedRecommendation.complexity} complexity</span>
              </div>
            </div>

            {selectedRecommendation.originalCode && selectedRecommendation.suggestedCode && (
              <DiffViewer
                originalCode={selectedRecommendation.originalCode}
                suggestedCode={selectedRecommendation.suggestedCode}
                fileName="recommended-changes.java"
                language="java"
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Patch
              </Button>
              <Button
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Apply Recommendation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;