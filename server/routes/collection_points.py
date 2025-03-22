from flask import Blueprint, jsonify, request
from models import db, CollectionPoint

collection_points_bp = Blueprint('collection_points', __name__)

@collection_points_bp.route('/api/collection-points', methods=['GET'])
def get_collection_points():
    try:
        collection_points = CollectionPoint.query.all()
        return jsonify([point.to_dict() for point in collection_points])
    except Exception as e:
        print(f"Error fetching collection points: {str(e)}")
        return jsonify({"error": str(e)}), 500

@collection_points_bp.route('/api/collection-points', methods=['POST'])
def create_collection_point():
    try:
        data = request.json
        collection_point = CollectionPoint(**data)
        db.session.add(collection_point)
        db.session.commit()
        return jsonify(collection_point.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@collection_points_bp.route('/api/collection-points/<int:id>', methods=['PUT'])
def update_collection_point(id):
    try:
        collection_point = CollectionPoint.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(collection_point, key, value)
        db.session.commit()
        return jsonify(collection_point.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@collection_points_bp.route('/api/collection-points/<int:id>', methods=['DELETE'])
def delete_collection_point(id):
    try:
        collection_point = CollectionPoint.query.get_or_404(id)
        db.session.delete(collection_point)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400 