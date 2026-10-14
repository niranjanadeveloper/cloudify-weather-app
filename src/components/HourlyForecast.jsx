import React from 'react';
import { Clock } from './Icons';
import { getWeatherIconUrl } from '../services/weatherApi';

export const HourlyForecast = ({ hourly, unit }) => {
  if (!hourly || hourly.length === 0) return null;

  const tempSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast-section hourly-section">
      <div className="section-header-row">
        <h3 className="section-title">
          <Clock size={19} className="title-icon" />
          Hourly Forecast (Next 24h)
        </h3>
        <span className="section-badge">3-Hour Intervals</span>
      </div>

      <div className="hourly-scroll-container">
        {hourly.map((item, index) => {
          const iconUrl = getWeatherIconUrl(item.icon);
          const isCurrentHour = index === 0;

          return (
            <div
              key={item.dt || index}
              className={`hourly-card ${isCurrentHour ? 'active-hour' : ''}`}
            >
              <span className="hourly-time">{item.time}</span>
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={item.description || item.condition}
                  className="hourly-icon"
                  loading="lazy"
                />
              ) : null}
              <span className="hourly-temp">
                {item.temp}{tempSymbol}
              </span>
              <span className="hourly-condition" title={item.description}>
                {item.condition}
              </span>
              {item.pop > 0 ? (
                <span className="hourly-pop" title="Precipitation Probability">
                  💧 {item.pop}%
                </span>
              ) : (
                <span className="hourly-pop-spacer"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;

