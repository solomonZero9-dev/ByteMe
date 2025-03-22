from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(200), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    waste_type = db.Column(db.String(50), nullable=False)
    assigned_team = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    waste_collected = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'location': self.location,
            'date_time': self.date_time.isoformat(),
            'waste_type': self.waste_type,
            'assigned_team': self.assigned_team,
            'status': self.status,
            'notes': self.notes,
            'waste_collected': self.waste_collected,
            'created_at': self.created_at.isoformat()
        }

class CollectionPoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    area = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Float, default=0.0)  # Current capacity in percentage
    status = db.Column(db.String(50), default='Active')  # Active, Maintenance, Full
    last_collection = db.Column(db.DateTime, nullable=True)
    next_collection = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_active_collections(self):
        return Collection.query.filter(
            Collection.location == self.address,
            Collection.status.in_(['scheduled', 'in_progress'])
        ).order_by(Collection.date_time).all()

    def update_collection_dates(self):
        collections = Collection.query.filter(
            Collection.location == self.address
        ).order_by(Collection.date_time.desc()).all()
        
        completed_collections = [c for c in collections if c.status == 'completed']
        if completed_collections:
            self.last_collection = completed_collections[0].date_time
        
        future_collections = [c for c in collections 
                            if c.status in ['scheduled', 'in_progress'] 
                            and c.date_time > datetime.now()]
        if future_collections:
            self.next_collection = min(c.date_time for c in future_collections)

    def to_dict(self):
        self.update_collection_dates()
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'area': self.area,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'capacity': self.capacity,
            'status': self.status,
            'last_collection': self.last_collection.strftime('%Y-%m-%d') if self.last_collection else None,
            'next_collection': self.next_collection.strftime('%Y-%m-%d') if self.next_collection else None,
            'created_at': self.created_at.isoformat()
        } 