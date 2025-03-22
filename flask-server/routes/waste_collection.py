from flask import Blueprint, request, jsonify

bp = Blueprint('waste_collection', __name__, url_prefix='/api/waste-collection')

@bp.route('/', methods=['GET'])
def get_collections():
    """Get all waste collection records"""
    return jsonify({"message": "Get all waste collections - To be implemented"})

@bp.route('/', methods=['POST'])
def create_collection():
    """Create a new waste collection record"""
    return jsonify({"message": "Create waste collection - To be implemented"})

@bp.route('/<int:collection_id>', methods=['GET'])
def get_collection(collection_id):
    """Get a specific waste collection record"""
    return jsonify({"message": f"Get waste collection {collection_id} - To be implemented"})

@bp.route('/<int:collection_id>', methods=['PUT'])
def update_collection(collection_id):
    """Update a waste collection record"""
    return jsonify({"message": f"Update waste collection {collection_id} - To be implemented"})

@bp.route('/<int:collection_id>', methods=['DELETE'])
def delete_collection(collection_id):
    """Delete a waste collection record"""
    return jsonify({"message": f"Delete waste collection {collection_id} - To be implemented"}) 