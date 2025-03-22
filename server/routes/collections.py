from flask import Blueprint, request, jsonify
from database import db
from models.collection import Collection
from datetime import datetime
import traceback

collections_bp = Blueprint('collections', __name__)

@collections_bp.route('/api/collections', methods=['GET'])
def get_collections():
    try:
        print("Fetching all collections...")
        collections = Collection.query.all()
        print(f"Found {len(collections)} collections")
        
        result = []
        for collection in collections:
            try:
                collection_dict = collection.to_dict()
                result.append(collection_dict)
                print(f"Collection {collection.id}: {collection_dict}")
            except Exception as e:
                print(f"Error converting collection {collection.id} to dict: {str(e)}")
                print(traceback.format_exc())
        
        print(f"Successfully converted {len(result)} collections to dict")
        response = jsonify(result)
        print("Response data:", result)
        return response
    except Exception as e:
        print(f"Error fetching collections: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@collections_bp.route('/api/collections', methods=['POST'])
def create_collection():
    try:
        data = request.get_json()
        print(f"Creating new collection with data: {data}")
        
        new_collection = Collection(
            location=data['location'],
            date_time=datetime.fromisoformat(data['date_time']),
            waste_type=data['waste_type'],
            assigned_team=data['assigned_team'],
            notes=data.get('notes'),
            status=data.get('status', 'scheduled')
        )
        
        db.session.add(new_collection)
        db.session.commit()
        print(f"Successfully created collection with ID: {new_collection.id}")
        
        return jsonify(new_collection.to_dict()), 201
    except Exception as e:
        print(f"Error creating collection: {str(e)}")
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@collections_bp.route('/api/collections/<int:collection_id>', methods=['GET'])
def get_collection(collection_id):
    try:
        print(f"Fetching collection with ID: {collection_id}")
        collection = Collection.query.get_or_404(collection_id)
        return jsonify(collection.to_dict())
    except Exception as e:
        print(f"Error fetching collection {collection_id}: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 404

@collections_bp.route('/api/collections/<int:collection_id>', methods=['PUT'])
def update_collection(collection_id):
    try:
        print(f"Updating collection with ID: {collection_id}")
        collection = Collection.query.get_or_404(collection_id)
        data = request.get_json()
        print(f"Update data: {data}")
        
        for key, value in data.items():
            if key == 'date_time':
                value = datetime.fromisoformat(value)
            if hasattr(collection, key):
                setattr(collection, key, value)
        
        db.session.commit()
        print("Successfully updated collection")
        return jsonify(collection.to_dict())
    except Exception as e:
        print(f"Error updating collection {collection_id}: {str(e)}")
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@collections_bp.route('/api/collections/<int:collection_id>', methods=['DELETE'])
def delete_collection(collection_id):
    try:
        print(f"Deleting collection with ID: {collection_id}")
        collection = Collection.query.get_or_404(collection_id)
        db.session.delete(collection)
        db.session.commit()
        print("Successfully deleted collection")
        return '', 204
    except Exception as e:
        print(f"Error deleting collection {collection_id}: {str(e)}")
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({'error': str(e)}), 400 