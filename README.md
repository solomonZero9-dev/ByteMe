# कचरा RE (Mumbai Waste Management System)

A modern web-based waste management system designed to optimize waste collection and recycling efforts in Mumbai, and is targeted for muncipal corporations. It integrates real-time tracking, analytics, and multilingual support to ensure efficient waste disposal and management.

कचरा RE is a smart waste economy platform connecting raddiwalas, government, recyclers, and citizens to turn waste into rewards. Here's the link to the mobile counterpart, targeted for users and local "raddiwalas":

https://github.com/KausLol/KachraRe-App

## Features

- 🎨 Smart Dashboard with real-time waste statistics
- 📍 Interactive Map with 10 strategic collection points
- 🗑 Collection Management (Schedule & Track Collections)
- 📊 Reports & Analytics for tracking waste trends
- 🔄 Real-time Status Updates on waste collection
- 🌍 Multilingual Support (English, Hindi, Marathi)

## Tech Stack

### Frontend

- React.js with Vite
- Material-UI for modern UI components
- Leaflet.js for interactive maps
- Chart.js for data visualization
- Context API for state management

### Backend

- Flask (Python) REST API
- SQLite database (scalable to PostgreSQL)
- SQLAlchemy ORM
- Flask-CORS for cross-origin support

## Screenshots

<img src="https://i.imgur.com/54XTjSP.png">
<img src="https://i.imgur.com/B0uyv5y.png">
<img src="https://i.imgur.com/H9gWCmT.png">


## Getting Started

### Backend Setup

1. Clone the repository and navigate to the backend folder:
```bash
cd flask-server
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python server.py
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

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

## Features (Coming Soon)

- Waste collection scheduling
- Route optimization
- Waste segregation tracking
- Advanced analytics and reporting
- User management


## Contributors & Acknowledgement

### Team ByteMe

This project was created as part of WEHACK Hackathon, where we had the opportunity to learn, innovate, and collaborate. We extend our gratitude to the organizers for providing an enriching experience that pushed our skills and creativity.

A special thanks to our collaborators:

- solomonZero9-dev
- KausLol
- Jeetruia
- RoyceAntony9


## License

This project is licensed under the MIT License - see the LICENSE file for details.
