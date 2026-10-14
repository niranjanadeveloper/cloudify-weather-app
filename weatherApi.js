// OpenWeatherMap API Service
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Returns the configured API key from Vite environment variables.
 */
export const getApiKey = () => {
  return import.meta.env.VITE_OPENWEATHER_API_KEY || '';
};

/**
 * Fetches current weather by city name.
 */
export const fetchCurrentWeather = async (city, unit = 'metric') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please verify the city name and try again.');
    }
    if (response.status === 401) {
      throw new Error('Invalid OpenWeather API Key. Please check your .env configuration.');
    }
    throw new Error(`Failed to fetch weather data (${response.status} ${response.statusText})`);
  }

  return await response.json();
};

/**
 * Fetches 5-day / 3-hour forecast by city name.
 */
export const fetchForecast = async (city, unit = 'metric') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const url = `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Forecast data not found for the requested city.');
    }
    if (response.status === 401) {
      throw new Error('Invalid OpenWeather API Key. Please check your .env configuration.');
    }
    throw new Error(`Failed to fetch forecast data (${response.status})`);
  }

  return await response.json();
};

/**
 * Fetches current weather by coordinates (for geolocation).
 */
export const fetchCurrentWeatherByCoords = async (lat, lon, unit = 'metric') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid OpenWeather API Key. Please check your .env configuration.');
    }
    throw new Error(`Failed to fetch weather for your location (${response.status})`);
  }

  return await response.json();
};

/**
 * Fetches forecast by coordinates.
 */
export const fetchForecastByCoords = async (lat, lon, unit = 'metric') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid OpenWeather API Key. Please check your .env configuration.');
    }
    throw new Error(`Failed to fetch forecast for your location (${response.status})`);
  }

  return await response.json();
};

/**
 * Helper to get OpenWeather 2x icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return '';
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Helper to process 5-day / 3-hour forecast list into:
 * 1. Hourly/upcoming forecast (next 8 intervals = 24 hours)
 * 2. Daily forecast (5 days with min/max temp)
 */
export const processForecastData = (forecastList) => {
  if (!forecastList || forecastList.length === 0) {
    return { hourly: [], daily: [] };
  }

  // Next 8 items (representing next 24 hours in 3h blocks)
  const hourly = forecastList.slice(0, 8).map((item) => ({
    dt: item.dt,
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0]?.icon,
    condition: item.weather[0]?.main,
    description: item.weather[0]?.description,
    pop: Math.round((item.pop || 0) * 100), // Probability of precipitation %
  }));

  // Group by date for 5-day forecast
  const dailyGroups = {};
  forecastList.forEach((item) => {
    const dateObj = new Date(item.dt * 1000);
    const dateKey = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (!dailyGroups[dateKey]) {
      dailyGroups[dateKey] = {
        dateKey,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateKey,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        icons: [item.weather[0]?.icon],
        descriptions: [item.weather[0]?.description],
        conditions: [item.weather[0]?.main],
      };
    } else {
      dailyGroups[dateKey].minTemp = Math.min(dailyGroups[dateKey].minTemp, item.main.temp_min);
      dailyGroups[dateKey].maxTemp = Math.max(dailyGroups[dateKey].maxTemp, item.main.temp_max);
      dailyGroups[dateKey].icons.push(item.weather[0]?.icon);
      dailyGroups[dateKey].descriptions.push(item.weather[0]?.description);
      dailyGroups[dateKey].conditions.push(item.weather[0]?.main);
    }
  });

  // Extract up to 5 days
  const daily = Object.values(dailyGroups)
    .slice(0, 5)
    .map((day) => {
      // Pick midday icon or middle entry
      const midIndex = Math.floor(day.icons.length / 2);
      return {
        dayName: day.dayName,
        fullDate: day.fullDate,
        minTemp: Math.round(day.minTemp),
        maxTemp: Math.round(day.maxTemp),
        icon: day.icons[midIndex] || day.icons[0],
        condition: day.conditions[midIndex] || day.conditions[0],
        description: day.descriptions[midIndex] || day.descriptions[0],
      };
    });

  return { hourly, daily };
};

