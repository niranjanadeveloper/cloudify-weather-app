# ☀️ Cloudify — Weather Forecast

A clean, modern, and fully responsive Weather Web Application built with **React.js** and **Vite**, powered by the **OpenWeatherMap API**.

Designed with a soft blue, white, and light-gray palette, glassmorphism cards, smooth interactions, and an adaptive layout suitable for front-end developer portfolios.

---

## ✨ Features

- 🔍 **City Search:** Search any city worldwide with instant results (supports pressing <kbd>Enter</kbd>).
- 📍 **Geolocation Detection:** One-click location access to fetch real-time local weather.
- 🔄 **Live Refresh:** Instantly refresh current weather data.
- 🌡️ **Metric & Imperial Toggle:** Toggle between Celsius (°C) and Fahrenheit (°F) with automatic unit persistence.
- 🌤️ **Current Weather Overview:**
  - City and country name
  - Formatted local date
  - Current temperature and "Feels like" reading
  - Daily minimum & maximum temperatures
  - Weather condition label with official OpenWeather graphic
- 📊 **Detailed Weather Highlights:**
  - Humidity percentage with qualitative level indicator
  - Wind speed & direction
  - Atmospheric pressure (hPa)
  - Visibility in kilometers
- 🕒 **Hourly Forecast (Next 24 Hours):**
  - Smooth horizontal scrolling cards for 3-hour forecast intervals
  - Hourly temperature, icon, condition, and precipitation probability (%)
- 📅 **5-Day Weather Forecast:**
  - Distinct forecast cards for upcoming days
  - Min/Max temperature progress bar and condition icons
- 💾 **Persistent Settings:** Remembers your last searched city and selected temperature unit using `localStorage`.
- ⚠️ **Graceful Error Handling:**
  - Interactive setup prompt when the API key is not yet configured.
  - Helpful error messages for unknown cities or network issues with a "Try Again" action.

---

## 🛠️ Project Structure

```text
Weather App/
├── public/
├── src/
│   ├── components/
│   │   ├── CurrentWeather.jsx   # Current weather card & temp ranges
│   │   ├── ErrorMessage.jsx     # Friendly error notifications & API setup card
│   │   ├── FiveDayForecast.jsx  # 5-day daily forecast cards
│   │   ├── HourlyForecast.jsx   # Horizontally scrollable 24-hour forecast
│   │   ├── Icons.jsx            # Clean, zero-dependency Lucide-style SVG icons
│   │   ├── Loading.jsx          # Polished pulse/spin loading indicator & skeleton
│   │   ├── SearchBar.jsx        # Search input, location & refresh buttons
│   │   └── WeatherDetails.jsx   # Grid cards for humidity, wind, pressure, visibility
│   ├── services/
│   │   └── weatherApi.js        # OpenWeather API integration and data transformation
│   ├── App.jsx                  # Main application controller and state
│   ├── index.css                # Fluid CSS Grid, Flexbox, glassmorphism & typography
│   └── main.jsx                 # Application entry point
├── .env                         # Local environment variables (add your API key here)
├── .env.example                 # Environment variables blueprint
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Configure Your OpenWeather API Key
1. Sign up for a free account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Generate your free API key in your account dashboard.
3. In the project folder `Weather App/`, open `.env` (or copy `.env.example` to `.env`):
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
4. Save the file.

### 3. Run Development Server
```bash
cd "Weather App"
npm run dev
```

Visit the displayed local URL in your browser (typically `http://localhost:5173/`).

### 4. Build for Production
```bash
npm run build
```
The output will be bundled inside the `dist/` directory.
