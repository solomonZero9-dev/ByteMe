from app import create_app, db
from models import Collection, CollectionPoint
from datetime import datetime, timedelta
import random

# Mumbai area coordinates (latitude, longitude)
MUMBAI_COORDINATES = {
    "Dadar": (19.0178, 72.8478),
    "Powai": (19.1176, 72.9060),
    "Colaba": (18.9067, 72.8147),
    "Chembur": (19.0522, 72.9005),
    "Goregaon": (19.1663, 72.8526),
    "Worli": (18.9986, 72.8174),
    "Ghatkopar": (19.0858, 72.9089),
    "Andheri": (19.1136, 72.8697),
    "Bandra": (19.0596, 72.8295),
    "Juhu": (19.0883, 72.8262)
}

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.session.query(Collection).delete()
        db.session.query(CollectionPoint).delete()
        db.session.commit()
        
        # List of street types
        street_types = ["Road", "Street", "Lane", "Marg", "Path", "Cross Road", "Main Road"]
        
        # List of street name components
        street_prefixes = [
            "Shivaji", "Gandhi", "Nehru", "Ambedkar", "Tilak", "Subhash",
            "Vivekananda", "Tagore", "Azad", "Bhagat Singh"
        ]
        
        # First create collection points
        collection_points = []
        areas = list(MUMBAI_COORDINATES.items())
        
        # Choose 2 random points to be at full capacity
        full_capacity_indices = random.sample(range(len(areas)), 2)
        
        for index, (area, coordinates) in enumerate(areas):
            street_name = f"{random.choice(street_prefixes)} {random.choice(street_types)}"
            address = f"{street_name}, {area}"
            
            # Set capacity and status based on whether this point should be full
            if index in full_capacity_indices:
                capacity = random.uniform(90, 100)  # Full capacity
                status = 'Full'
            else:
                capacity = random.uniform(50, 89.9)  # Not full
                status = 'Maintenance' if random.random() < 0.2 else 'Active'
            
            capacity = round(capacity, 1)
            
            collection_point = CollectionPoint(
                name=f"{area} Collection Center",
                address=address,
                area=area,
                latitude=coordinates[0],
                longitude=coordinates[1],
                capacity=capacity,
                status=status
            )
            db.session.add(collection_point)
            collection_points.append(collection_point)
        
        db.session.commit()
        print("Collection points created successfully!")
        
        # Now create collections using the collection points
        for point in collection_points:
            # Create 3-5 collections for each point
            num_collections = random.randint(3, 5)
            for _ in range(num_collections):
                # Generate a random date within the last 30 days
                days_ago = random.randint(-7, 30)  # Allow future dates for scheduled collections
                collection_date = datetime.now() - timedelta(days=days_ago)
                
                # Generate a random time between 6 AM and 8 PM
                hour = random.randint(6, 20)
                minute = random.choice([0, 15, 30, 45])
                collection_date = collection_date.replace(hour=hour, minute=minute)
                
                # Set status based on date
                if collection_date > datetime.now():
                    status = 'scheduled'
                elif collection_date.date() == datetime.now().date():
                    status = random.choice(['in_progress', 'completed'])
                else:
                    status = 'completed'
                
                # Create collection entry
                collection = Collection(
                    location=point.address,
                    date_time=collection_date,
                    waste_type=random.choice(["general", "recyclable", "hazardous", "organic", "electronic", "medical"]),
                    assigned_team=f"Team {random.randint(1, 6)}",
                    status=status,
                    notes=f"Collection at {point.name}",
                    waste_collected=round(random.uniform(10, 500), 2) if status == 'completed' else 0.0
                )
                db.session.add(collection)
        
        db.session.commit()
        print("Collections created successfully!")

if __name__ == "__main__":
    seed_database() 