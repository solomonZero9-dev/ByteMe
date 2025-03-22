# Waste Management System

A full-stack web application for managing waste collection and disposal operations.

## Project Structure
```
waste-management/
├── flask-server/          # Backend Flask application
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── client/               # Frontend React application
│   ├── public/          # Static files
│   └── src/             # React source code
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
```

## Technology Stack
- Backend: Flask (Python)
- Frontend: React (JavaScript/TypeScript)
- Database: SQLite (can be scaled to PostgreSQL)

## Setup Instructions

### Backend Setup
1. Navigate to the flask-server directory
```bash
cd flask-server
```
2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
3. Install dependencies
```bash
pip install -r requirements.txt
```
4. Run the server
```bash
python server.py
```

### Frontend Setup
1. Navigate to the client directory
```bash
cd client
```
2. Install dependencies
```bash
npm install
```
3. Run the development server
```bash
npm start
```

## Features (Coming Soon)
- Waste collection scheduling
- Route optimization
- Waste segregation tracking
- Analytics and reporting
- User management 
