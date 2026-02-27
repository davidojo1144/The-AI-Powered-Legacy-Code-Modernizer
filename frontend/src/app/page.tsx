import { useState, useCallback } from 'react';
import { Upload, FileText, BarChart3, Cloud, Code, Zap } from 'lucide-react';

interface Analysis {
  id: string;
  projectName: string;
  description: string;
  targetPlatform: string;
  analysisDepth: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  findings: number;
  recommendations: number;
}

interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('cloud');
  const [analysisDepth, setAnalysisDepth] = useState('comprehensive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses] = useState<Analysis[]>([
    {
      id: '1',
      projectName: 'Legacy Banking System',
      description: 'Core banking application from 2015',
      targetPlatform: 'cloud',
      analysisDepth: 'comprehensive',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-15',
      findings: 47,
      recommendations: 23
    },
    {
      id: '2',
      projectName: 'E-commerce Platform',
      description: 'Online retail platform using old frameworks',
      targetPlatform: 'kubernetes',
      analysisDepth: 'standard',
      status: 'processing',
      progress: 75,
      createdAt: '2024-01-14',
      findings: 0,
      recommendations: 0
    }
  ]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: FileUpload[] = droppedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles: FileUpload[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!projectName.trim() || files.length === 0) {
      alert('Please enter a project name and select files to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Analysis completed! Check the results below.');
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Legacy Code Modernizer</h1>
                <p className="text-sm text-gray-300">AI-powered legacy code analysis</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-white hover:text-blue-300 transition-colors">Dashboard</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">Analyses</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">Reports</a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Transform Your Legacy Code with AI
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Upload your legacy codebase and get comprehensive analysis with AI-powered modernization recommendations. 
            Save millions in assessment time with our automated consultant-in-a-box.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-blue-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Code className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h3>
              <p className="text-gray-300">Analyze Java, JavaScript, Python, C#, and COBOL codebases</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-purple-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-300">Get actionable recommendations from our multi-agent AI system</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-green-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Cloud className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cloud-Ready Reports</h3>
              <p className="text-gray-300">Detailed migration roadmaps for cloud deployment</p>
            </div>
          </div>
        </div>

        {/* Analysis Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Upload className="h-6 w-6 mr-3 text-blue-400" />
            Start New Analysis
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your project and modernization goals"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Target Platform
                  </label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cloud">Cloud</option>
                    <option value="kubernetes">Kubernetes</option>
                    <option value="serverless">Serverless</option>
                    <option value="microservices">Microservices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Analysis Depth
                  </label>
                  <select
                    value={analysisDepth}
                    onChange={(e) => setAnalysisDepth(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="quick">Quick</option>
                    <option value="standard">Standard</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-white/30 hover:border-white/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Drag and drop your files here</p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Selected Files ({files.length})</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !projectName.trim() || files.length === 0}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Analysis
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Analyses</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{analysis.projectName}</h4>
                    <p className="text-sm text-gray-400">{analysis.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    analysis.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    analysis.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    analysis.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {analysis.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{analysis.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysis.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm mt-4">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-gray-400">Findings: <span className="text-white">{analysis.findings}</span></span>
                    </div>
                    <div className="flex items-center">
                      <Cloud className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-gray-400">Recommendations: <span className="text-white">{analysis.recommendations}</span></span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {analysis.createdAt}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                    Download Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              Built with ❤️ by the developer community | 
              <a href="https://github.com/davidojo1144" className="text-blue-400 hover:text-blue-300 ml-1">
                @davidojo1144
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}