# Tableau Lineage Visualizer

A powerful tool to extract and visualize Tableau workbook metadata, calculated field dependencies, and data lineage.

## 📦 Project Structure

This project consists of two separate repositories:

- **Frontend (Next.js)**: https://github.com/andey0Saikiran/tableau-lineage-frontend
- **Backend (FastAPI)**: https://github.com/andey0Saikiran/tableau-lineage-backend

## 🚀 Quick Start

See [RUNNING.md](RUNNING.md) for detailed instructions on how to run the application.

**TL;DR:**
```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open http://localhost:3000
```

## ✨ Features

- 📊 **Metadata Extraction**: Parse .twbx files and extract calculated fields
- 🔗 **Dependency Analysis**: Visualize field dependencies and relationships
- 🎯 **LOD Detection**: Identify FIXED, INCLUDE, and EXCLUDE calculations
- ⚙️ **Parameter Tracking**: Track parameter usage across calculations
- 🌍 **Multi-language Support**: English, Spanish, French, German, Hindi, Telugu, Tamil
- 🔒 **Privacy-First**: All processing happens locally, no data stored

## 🛠️ Technology Stack

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI
- Python 3.8+
- lxml (XML parsing)
- SQLite (analytics)

## 📚 Documentation

- [RUNNING.md](RUNNING.md) - Complete guide to running the application
- [Frontend README](frontend/README.md) - Frontend-specific documentation
- [Backend API](backend/main.py) - Backend API documentation

## 🐛 Recent Fixes

✅ Fixed API URL mismatch between frontend and backend
✅ Fixed Next.js 16 metadata viewport warnings
✅ Re-enabled React Strict Mode
✅ Fixed critical backend caching issue with file uploads
✅ Added proper .gitignore files
✅ Made console logging development-only

## 📝 License

This project is for educational and analytical purposes.

## 🤝 Contributing

1. Fork the repository (frontend or backend)
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

For questions or issues, please open an issue on the respective repository.

---

**Built with ❤️ for Tableau analysts and developers**
