import React from 'react';
import { Calendar, ArrowDown, ArrowUp } from './Icons';
import { getWeatherIconUrl } from '../services/weatherApi';

export const FiveDayForecast = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  const tempSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast-section fiveday-section">
      <div className="section-header-row">
        <h3 className="section-title">
          <Calendar size={19} className="title-icon" />
          5-Day Forecast
        </h3>
        <span className="section-badge">Upcoming Days</span>
      </div>

      <div className="fiveday-list">
        {daily.map((day, index) => {
          const iconUrl = getWeatherIconUrl(day.icon);
          const isToday = index === 0;

          return (
            <div key={day.dateKey || index} className="fiveday-card">
              <div className="day-name-group">
                <span className="day-title">
                  {isToday ? 'Today' : day.dayName}
                </span>
                <span className="day-date">{day.fullDate}</span>
              </div>

              <div className="day-condition-group">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={day.condition}
                    className="fiveday-icon"
                    loading="lazy"
                  />
                ) : null}
                <span className="day-condition-text">{day.condition}</span>
              </div>

              <div className="day-temp-range">
                <div className="day-temp-pill min">
                  <ArrowDown size={13} />
                  <span>{day.minTemp}{tempSymbol}</span>
                </div>
                <div className="day-temp-bar-bg">
                  <div className="day-temp-bar-fill"></div>
                </div>
                <div className="day-temp-pill max">
                  <ArrowUp size={13} />
                  <span>{day.maxTemp}{tempSymbol}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiveDayForecast;

