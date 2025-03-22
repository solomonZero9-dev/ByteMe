from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Collection, CollectionPoint
from datetime import datetime
from routes.collection_points import collection_points_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///waste_management.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(collection_points_bp)
    
    # Create tables
    with app.app_context():
        # Create all tables if they don't exist
        db.create_all()

    # Collections routes
    @app.route('/api/collections', methods=['GET'])
    def get_collections():
        collections = Collection.query.all()
        return jsonify([collection.to_dict() for collection in collections])

    @app.route('/api/collections', methods=['POST'])
    def create_collection():
        data = request.json
        collection = Collection(**data)
        db.session.add(collection)
        db.session.commit()
        return jsonify(collection.to_dict()), 201

    @app.route('/api/collections/<int:id>', methods=['PUT'])
    def update_collection(id):
        collection = Collection.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(collection, key, value)
        db.session.commit()
        return jsonify(collection.to_dict())

    @app.route('/api/collections/<int:id>', methods=['DELETE'])
    def delete_collection(id):
        collection = Collection.query.get_or_404(id)
        db.session.delete(collection)
        db.session.commit()
        return '', 204

    @app.route('/api/statistics', methods=['GET'])
    def get_statistics():
        try:
            # Get collection points statistics
            collection_points = CollectionPoint.query.all()
            total_points = len(collection_points)
            bins_at_capacity = len([p for p in collection_points if p.status == 'Full'])
            
            # Get collections statistics
            collections = Collection.query.filter_by(status='completed').all()
            total_waste = sum(c.waste_collected for c in collections if c.waste_collected)
            recyclable_waste = sum(c.waste_collected for c in collections 
                                 if c.waste_collected and c.waste_type.lower() == 'recyclable')
            
            recycling_rate = (recyclable_waste / total_waste * 100) if total_waste > 0 else 0
            
            return jsonify({
                'totalWaste': total_waste,
                'recyclingRate': round(recycling_rate),
                'activePoints': total_points,
                'binsAtCapacity': bins_at_capacity
            })
        except Exception as e:
            print(f"Error getting statistics: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=8080, debug=True) 