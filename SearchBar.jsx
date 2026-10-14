import React, { useState } from 'react';
import { Search, Navigation, RefreshCw } from './Icons';

export const SearchBar = ({ onSearch, onUseLocation, onRefresh, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <div className="search-input-group">
          <Search className="search-input-icon" size={19} />
          <input
            type="text"
            className="search-input"
            placeholder="Search city (e.g. London, Tokyo, New York)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            aria-label="City name"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary search-submit-btn"
          disabled={isLoading || !searchTerm.trim()}
          title="Search weather"
        >
          Search
        </button>
      </form>

      <div className="search-actions">
        <button
          type="button"
          className="btn btn-secondary action-btn"
          onClick={onUseLocation}
          disabled={isLoading}
          title="Use current GPS location"
        >
          <Navigation size={17} />
          <span className="btn-label">Current Location</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary action-btn icon-only"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh current weather"
          aria-label="Refresh weather data"
        >
          <RefreshCw size={17} className={isLoading ? 'spin-animation' : ''} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

