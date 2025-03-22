import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography } from '@mui/material';

const MapComponent = ({ points, onError }) => {
  const [mapCenter] = useState([19.0760, 72.8777]); // Mumbai center coordinates

  // Report any errors to parent
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, [onError]);

  try {
    return (
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          setTimeout(() => {
            map.invalidateSize();
          }, 0);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={point.position || [
              19.0760 + (Math.random() - 0.5) * 0.1,
              72.8777 + (Math.random() - 0.5) * 0.1
            ]}
          >
            <Popup>
              <div>
                <Typography variant="subtitle1" component="div">
                  {point.name}
                </Typography>
                <Typography variant="body2" component="div">
                  {point.address}
                </Typography>
                <Typography variant="body2" component="div">
                  Status: {point.status}
                  <br />
                  Capacity: {point.capacity}%
                </Typography>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  } catch (error) {
    console.error("Error rendering map:", error);
    if (onError) onError(error);
    return null;
  }
};

export default MapComponent; 