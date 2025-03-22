# Mumbai Waste Management System

## Overview (1-Minute Explanation)
A comprehensive waste management solution for Mumbai city that enables real-time tracking and management of waste collection activities.

### Key Features
- **Smart Dashboard**
  - Real-time statistics (Total Waste Collected, Recycling Rate)
  - Active Collection Points monitoring
  - Bins capacity status
  - Waste distribution visualization

- **Collection Management**
  - Schedule and track waste collections
  - Team assignments (Teams 1-6)
  - Status tracking (Scheduled, In Progress, Completed)
  - Multiple waste types (General, Recyclable, Hazardous, etc.)

- **Collection Points**
  - Interactive map with 10 strategic locations across Mumbai
  - Real-time capacity monitoring
  - Status indicators (Active, Maintenance, Full)
  - Detailed point information and history

- **Reports & Analytics**
  - Waste type distribution charts
  - Collection trends analysis
  - Team performance metrics
  - Recycling rate tracking

- **Multilingual Support**
  - English
  - Hindi (हिंदी)
  - Marathi (मराठी)

### Tech Stack
- **Frontend**
  - React.js with Vite
  - Material-UI for modern UI components
  - Leaflet.js for interactive maps
  - Chart.js for data visualization
  - Context API for state management

- **Backend**
  - Flask (Python) REST API
  - SQLite database
  - SQLAlchemy ORM
  - Flask-CORS for cross-origin support

### Getting Started
1. Clone the repository
2. Start the Flask server:
   ```bash
   cd server
   python app.py
   ```
3. Start the React client:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Contributors
- Team ByteMe

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
