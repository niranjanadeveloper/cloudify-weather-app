import React from 'react';
import { Sun } from './Icons';

export const Loading = ({ message = 'Fetching latest weather data...' }) => {
  return (
    <div className="loading-state-container" role="status" aria-live="polite">
      <div className="loading-spinner-wrap">
        <div className="pulse-ring"></div>
        <Sun size={36} className="spinner-icon spin-animation" />
      </div>
      <p className="loading-message">{message}</p>
      <div className="loading-skeleton-grid">
        <div className="skeleton-box skeleton-card"></div>
        <div className="skeleton-box skeleton-highlights"></div>
      </div>
    </div>
  );
};

export default Loading;

