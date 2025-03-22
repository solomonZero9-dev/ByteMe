from flask import Blueprint, request, jsonify
from database import db
from models.recycling_center import RecyclingCenter

recycling_centers_bp = Blueprint('recycling_centers', __name__)

@recycling_centers_bp.route('/api/recycling-centers', methods=['GET'])
def get_recycling_centers():
    centers = RecyclingCenter.query.all()
    return jsonify([center.to_dict() for center in centers])

@recycling_centers_bp.route('/api/recycling-centers', methods=['POST'])
def create_recycling_center():
    data = request.get_json()
    
    try:
        new_center = RecyclingCenter(
            name=data['name'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            hours=data['hours'],
            materials=data['materials'],
            capacity=data['capacity'],
            status=data['status']
        )
        
        db.session.add(new_center)
        db.session.commit()
        
        return jsonify(new_center.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@recycling_centers_bp.route('/api/recycling-centers/<int:center_id>', methods=['GET'])
def get_recycling_center(center_id):
    center = RecyclingCenter.query.get_or_404(center_id)
    return jsonify(center.to_dict())

@recycling_centers_bp.route('/api/recycling-centers/<int:center_id>', methods=['PUT'])
def update_recycling_center(center_id):
    center = RecyclingCenter.query.get_or_404(center_id)
    data = request.get_json()
    
    try:
        for key, value in data.items():
            if hasattr(center, key):
                setattr(center, key, value)
        
        db.session.commit()
        return jsonify(center.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@recycling_centers_bp.route('/api/recycling-centers/<int:center_id>', methods=['DELETE'])
def delete_recycling_center(center_id):
    center = RecyclingCenter.query.get_or_404(center_id)
    
    try:
        db.session.delete(center)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400 