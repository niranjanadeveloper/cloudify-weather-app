import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import FiveDayForecast from './components/FiveDayForecast';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import { Sun, Cloud } from './components/Icons';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords,
  processForecastData,
  getApiKey,
} from './services/weatherApi';

const DEFAULT_CITY = 'London';
const STORAGE_CITY_KEY = 'weather_app_last_city';
const STORAGE_UNIT_KEY = 'weather_app_unit';

function App() {
  const [city, setCity] = useState(() => {
    return localStorage.getItem(STORAGE_CITY_KEY) || DEFAULT_CITY;
  });
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem(STORAGE_UNIT_KEY) || 'metric'; // 'metric' (°C) or 'imperial' (°F)
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  // Sync unit choice to LocalStorage
  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    localStorage.setItem(STORAGE_UNIT_KEY, newUnit);
  };

  // Main weather loader by city name
  const loadWeatherByCity = useCallback(
    async (cityName, selectedUnit = unit) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        setIsApiKeyMissing(true);
        setError('OpenWeather API Key is not configured.');
        return;
      }

      setIsApiKeyMissing(false);
      setIsLoading(true);
      setError(null);

      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(cityName, selectedUnit),
          fetchForecast(cityName, selectedUnit),
        ]);

        setCurrentWeather(weatherData);
        const { hourly, daily } = processForecastData(forecastData.list);
        setHourlyForecast(hourly);
        setDailyForecast(daily);

        // Update city and save to local storage
        setCity(weatherData.name || cityName);
        localStorage.setItem(STORAGE_CITY_KEY, weatherData.name || cityName);
      } catch (err) {
        if (err.message === 'API_KEY_MISSING') {
          setIsApiKeyMissing(true);
          setError('OpenWeather API Key is missing.');
        } else {
          setError(err.message || 'Unable to fetch weather data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [unit]
  );

  // Load weather by GPS Coordinates
  const loadWeatherByCoords = useCallback(
    async (lat, lon, selectedUnit = unit) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        setIsApiKeyMissing(true);
        setError('OpenWeather API Key is not configured.');
        return;
      }

      setIsApiKeyMissing(false);
      setIsLoading(true);
      setError(null);

      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeatherByCoords(lat, lon, selectedUnit),
          fetchForecastByCoords(lat, lon, selectedUnit),
        ]);

        setCurrentWeather(weatherData);
        const { hourly, daily } = processForecastData(forecastData.list);
        setHourlyForecast(hourly);
        setDailyForecast(daily);

        const fetchedCity = weatherData.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        setCity(fetchedCity);
        localStorage.setItem(STORAGE_CITY_KEY, fetchedCity);
      } catch (err) {
        if (err.message === 'API_KEY_MISSING') {
          setIsApiKeyMissing(true);
          setError('OpenWeather API Key is missing.');
        } else {
          setError(err.message || 'Failed to fetch weather for your location.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [unit]
  );

  // Geolocation trigger
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadWeatherByCoords(latitude, longitude, unit);
      },
      (geoError) => {
        setIsLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. Please enable location access or search manually.');
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError('Location information is currently unavailable.');
        } else {
          setError('Unable to retrieve location. Please search for a city.');
        }
      },
      { timeout: 10000 }
    );
  };

  // Initial load or city change
  useEffect(() => {
    loadWeatherByCity(city, unit);
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh handler
  const handleRefresh = () => {
    loadWeatherByCity(city, unit);
  };

  // Search handler
  const handleSearch = (searchedCity) => {
    loadWeatherByCity(searchedCity, unit);
  };

  return (
    <div className="app-container">
      {/* Decorative ambient background glows */}
      <div className="ambient-blob blob-1" aria-hidden="true"></div>
      <div className="ambient-blob blob-2" aria-hidden="true"></div>

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo-wrap">
            <Sun size={24} className="brand-icon sun" />
            <Cloud size={20} className="brand-icon cloud" />
          </div>
          <div>
            <h1 className="brand-title">Cloudify</h1>
            <p className="brand-subtitle">Your Weather, Simplified</p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle" role="group" aria-label="Temperature unit selection">
          <button
            type="button"
            className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
            onClick={() => handleUnitToggle('metric')}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
            onClick={() => handleUnitToggle('imperial')}
          >
            °F
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="dashboard-content">
        {/* Search Bar section */}
        <SearchBar
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Error / Missing API Key display */}
        {error && (
          <ErrorMessage
            error={error}
            isApiKeyMissing={isApiKeyMissing}
            onRetry={handleRefresh}
          />
        )}

        {/* Loading Spinner */}
        {isLoading && <Loading />}

        {/* Weather Dashboard View */}
        {!isLoading && !error && currentWeather && (
          <div className="weather-dashboard-layout">
            {/* Top Row: Current weather & highlights */}
            <div className="dashboard-top-row">
              <CurrentWeather weather={currentWeather} unit={unit} />
              <WeatherDetails weather={currentWeather} unit={unit} />
            </div>

            {/* Middle Row: Hourly Forecast */}
            <HourlyForecast hourly={hourlyForecast} unit={unit} />

            {/* Bottom Row: 5-Day Forecast */}
            <FiveDayForecast daily={dailyForecast} unit={unit} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Data provided by{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeatherMap
          </a>
          . Crafted for Portfolio.
        </p>
      </footer>
    </div>
  );
}

export default App;
