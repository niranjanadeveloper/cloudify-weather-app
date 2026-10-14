import React from 'react';
import { AlertCircle, KeyRound } from './Icons';

export const ErrorMessage = ({ error, onRetry, isApiKeyMissing }) => {
  if (!error) return null;

  if (isApiKeyMissing) {
    return (
      <div className="error-card api-key-card" role="alert">
        <div className="error-icon-wrapper api-key-icon">
          <KeyRound size={28} />
        </div>
        <div className="error-content">
          <h3 className="error-title">OpenWeather API Key Required</h3>
          <p className="error-text">
            To view live real-time weather information, configure your free API key from OpenWeatherMap.
          </p>
          <div className="api-setup-steps">
            <ol>
              <li>
                Sign up and get a free API key at{' '}
                <a
                  href="https://home.openweathermap.org/users/sign_up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  openweathermap.org
                </a>
              </li>
              <li>
                Open or create the file <code>.env</code> in your project root.
              </li>
              <li>
                Add the line: <br />
                <code>VITE_OPENWEATHER_API_KEY=your_actual_api_key_here</code>
              </li>
              <li>Restart the Vite dev server (<code>npm run dev</code>).</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="error-card" role="alert">
      <div className="error-icon-wrapper">
        <AlertCircle size={26} />
      </div>
      <div className="error-content">
        <h3 className="error-title">Unable to Load Weather</h3>
        <p className="error-text">{error}</p>
        {onRetry ? (
          <button type="button" className="btn btn-secondary retry-btn" onClick={onRetry}>
            Try Again
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorMessage;

