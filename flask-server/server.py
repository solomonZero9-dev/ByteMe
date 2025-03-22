from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///waste_management.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Import routes after db initialization to avoid circular imports
from routes import waste_collection, users, analytics

# Register blueprints
app.register_blueprint(waste_collection.bp)
app.register_blueprint(users.bp)
app.register_blueprint(analytics.bp)

@app.route("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "waste-management-api"}

if __name__ == "__main__":
    app.run(debug=True)
