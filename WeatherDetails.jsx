import React from 'react';
import { Droplets, Wind, Gauge, Eye, Thermometer } from './Icons';

export const WeatherDetails = ({ weather, unit }) => {
  if (!weather) return null;

  const humidity = weather.main?.humidity ?? '--';
  const windSpeed = weather.wind?.speed ?? '--';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const pressure = weather.main?.pressure ?? '--';
  const visibilityMeters = weather.visibility;
  const visibilityKm = visibilityMeters !== undefined ? (visibilityMeters / 1000).toFixed(1) : '--';
  const seaLevel = weather.main?.sea_level;

  const detailItems = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${humidity}%`,
      subtext: humidity > 70 ? 'High humidity' : humidity < 30 ? 'Dry air' : 'Comfortable',
      icon: <Droplets size={22} className="detail-icon droplets" />,
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${windSpeed} ${windUnit}`,
      subtext: weather.wind?.deg ? `Direction: ${weather.wind.deg}°` : 'Breeze',
      icon: <Wind size={22} className="detail-icon wind" />,
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${pressure} hPa`,
      subtext: seaLevel ? `Sea level: ${seaLevel} hPa` : 'Atmospheric',
      icon: <Gauge size={22} className="detail-icon gauge" />,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${visibilityKm} km`,
      subtext: visibilityMeters >= 10000 ? 'Clear visibility' : 'Moderate visibility',
      icon: <Eye size={22} className="detail-icon eye" />,
    },
  ];

  return (
    <div className="weather-details-section">
      <h3 className="section-title">Weather Highlights</h3>
      <div className="details-grid">
        {detailItems.map((item) => (
          <div key={item.id} className="detail-card">
            <div className="detail-header">
              <span className="detail-label">{item.label}</span>
              <div className="detail-icon-box">{item.icon}</div>
            </div>
            <div className="detail-value">{item.value}</div>
            <div className="detail-subtext">{item.subtext}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;

