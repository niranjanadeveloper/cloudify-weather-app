import React from 'react';
import { MapPin, ArrowUp, ArrowDown } from './Icons';
import { getWeatherIconUrl } from '../services/weatherApi';

export const CurrentWeather = ({ weather, unit }) => {
  if (!weather) return null;

  const tempSymbol = unit === 'metric' ? '°C' : '°F';
  const iconUrl = getWeatherIconUrl(weather.weather?.[0]?.icon);
  const condition = weather.weather?.[0]?.description || 'Clear';
  const cityName = weather.name;
  const country = weather.sys?.country;
  const currentTemp = Math.round(weather.main?.temp);
  const feelsLike = Math.round(weather.main?.feels_like);
  const tempMin = Math.round(weather.main?.temp_min);
  const tempMax = Math.round(weather.main?.temp_max);

  // Format date
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="current-weather-card">
      <div className="current-weather-header">
        <div className="location-info">
          <div className="location-title">
            <MapPin size={22} className="location-pin" />
            <h2>
              {cityName}
              {country ? <span className="country-tag">, {country}</span> : null}
            </h2>
          </div>
          <p className="current-date">{dateFormatted}</p>
        </div>

        <div className="weather-badge">
          {weather.weather?.[0]?.main || 'Weather'}
        </div>
      </div>

      <div className="current-weather-body">
        <div className="temp-display-wrap">
          <div className="temp-large">
            <span className="temp-number">{currentTemp}</span>
            <span className="temp-unit">{tempSymbol}</span>
          </div>
          <p className="feels-like-text">
            Feels like <strong>{feelsLike}{tempSymbol}</strong>
          </p>
        </div>

        <div className="condition-visual">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={condition}
              className="weather-main-icon"
              loading="lazy"
            />
          ) : null}
          <span className="condition-caption">{condition}</span>
        </div>
      </div>

      <div className="current-weather-footer">
        <div className="temp-range-item">
          <div className="temp-range-badge low">
            <ArrowDown size={14} />
            <span>Low: {tempMin}{tempSymbol}</span>
          </div>
        </div>
        <div className="temp-range-item">
          <div className="temp-range-badge high">
            <ArrowUp size={14} />
            <span>High: {tempMax}{tempSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;

