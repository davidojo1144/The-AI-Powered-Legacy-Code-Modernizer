# AI-Powered Legacy Code Modernizer

An automated analysis tool that ingests legacy codebases and generates a detailed, AI-driven modernization roadmap with specific code recommendations.

## 🚀 Overview

Large enterprises spend millions manually analyzing old COBOL, Java, or .NET apps to plan cloud migrations. This tool acts as a "consultant in a box," saving initial assessment time and providing actionable data.

## 🛠️ Tech Stack

### Frontend
- **Next.js** (React) with TypeScript
- **Tailwind CSS** for modern UI
- **Chart.js** for data visualization
- **React Query** for API state management

### Backend
- **FastAPI** for high-performance async endpoints
- **Python** with modern async support
- **PostgreSQL** for data storage
- **Redis** for caching and job queues

### AI/ML
- **LangChain** for workflow orchestration
- **Tree-sitter** for code parsing into ASTs
- **Ollama** for local AI models (Llama 3, CodeQwen)
- **Celery** for background task processing

## ✨ Key Features

### Code Analysis
- **Multi-language Support**: Java, JavaScript, Python, C#, COBOL
- **AST Parsing**: Deep semantic understanding of code structure
- **Dependency Mapping**: Visualize tight couplings and architecture
- **Security Scanning**: Identify vulnerabilities and code smells

### AI-Powered Recommendations
- **Scanner Agent**: Identifies frameworks and deprecated libraries
- **Dependency Mapper**: Visualizes tight couplings that make migration hard
- **Cloud-Readiness Agent**: Suggests specific cloud-native patterns
- **Diff-Style Reports**: Interactive PR-style recommendations

### Dashboard Features
- **Real-time Progress**: Track analysis progress
- **Interactive Visualizations**: Charts, graphs, and dependency maps
- **Export Options**: PDF reports, JSON data, Figma integration
- **Team Collaboration**: Share analysis results and recommendations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   FastAPI       │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Tailwind      │    │   LangChain     │    │   Redis         │
│   UI Components │    │   AI Agents     │    │   Cache/Queue   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Chart.js      │    │   Ollama        │
│   Visualizations│    │   Local AI      │
└─────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Ollama (for local AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/davidojo1144/legacy-code-modernizer.git
   cd legacy-code-modernizer
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   Create `.env` files in both frontend and backend directories with necessary configurations.

5. **Start Services**
   ```bash
   # Start backend
   cd backend && python main.py
   
   # Start frontend
   cd frontend && npm run dev
   ```

## 📊 Analysis Process

1. **Code Upload**: Users drag-and-drop or select legacy code files
2. **AST Parsing**: Tree-sitter parses code into semantic structures
3. **AI Analysis**: Multi-agent system analyzes code patterns and dependencies
4. **Recommendation Generation**: AI generates modernization roadmaps
5. **Report Generation**: Interactive dashboard with diff-style recommendations

## 🔧 Development

### Backend Development
- FastAPI with async/await for high performance
- SQLAlchemy for database ORM
- Celery for background task processing
- LangChain for AI agent orchestration

### Frontend Development
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Query for API state management

### AI Integration
- Ollama for local AI model hosting
- LangChain for agent workflows
- Tree-sitter for multi-language parsing
- Custom agents for specific analysis tasks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📞 Contact

- **Email**: davco1144@gmail.com
- **GitHub**: [@davidojo1144](https://github.com/davidojo1144)

## 🎯 Roadmap

- [ ] Multi-language support expansion
- [ ] Cloud deployment templates
- [ ] Integration with CI/CD pipelines
- [ ] Advanced security scanning
- [ ] Machine learning model training
- [ ] Enterprise features (SSO, RBAC)
- [ ] Mobile application
- [ ] VS Code extension

---

**Built with ❤️ for the developer community**