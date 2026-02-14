import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

/**
 * LocationPicker - Autocomplete location input using Nominatim (OpenStreetMap)
 * 
 * Props:
 * - value: { name: string, lat: number, lng: number } | null
 * - onChange: (location: { name: string, lat: number, lng: number } | null) => void
 * - placeholder: string
 * - disabled: boolean
 * - inputStyle: object (custom input styles)
 */
const LocationPicker = ({ value, onChange, placeholder = "Search location...", disabled = false, inputStyle = {} }) => {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync query with value when value changes externally
  useEffect(() => {
    if (value?.name && value.name !== query) {
      setQuery(value.name);
    }
  }, [value?.name]);

  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Nominatim API - free, no key required
      // Limit to Madagascar with countrycodes=mg
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `format=json&` +
        `countrycodes=mg&` +
        `limit=5&` +
        `addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'AlaApp/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSuggestions(data.map(item => ({
        id: item.place_id,
        name: item.display_name,
        shortName: item.address?.city || item.address?.town || item.address?.village || item.address?.state || item.name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      })));
      setShowDropdown(true);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Clear the selected value if user is typing
    if (value && newQuery !== value.name) {
      onChange(null);
    }

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchLocations(newQuery);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.shortName || suggestion.name);
    onChange({
      name: suggestion.shortName || suggestion.name,
      lat: suggestion.lat,
      lng: suggestion.lng
    });
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <MapPin 
          size={16} 
          style={{ 
            position: 'absolute', 
            left: 10, 
            color: '#A7C7BC',
            pointerEvents: 'none'
          }} 
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 32px 8px 32px',
            background: 'rgba(0,0,0,0.2)',
            border: value ? '1px solid #4ADE80' : '1px solid #2E7D67',
            borderRadius: 8,
            color: 'white',
            fontSize: 14,
            outline: 'none',
            ...inputStyle
          }}
        />
        {loading ? (
          <Loader2 
            size={16} 
            style={{ 
              position: 'absolute', 
              right: 10, 
              color: '#4ADE80',
              animation: 'spin 1s linear infinite'
            }} 
          />
        ) : query && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} color="#A7C7BC" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: '#0D4D3A',
          border: '1px solid #2E7D67',
          borderRadius: 8,
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(46, 125, 103, 0.3)',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(74, 222, 128, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <div style={{ color: '#F2F1EE', fontSize: 14, fontWeight: 500 }}>
                {suggestion.shortName}
              </div>
              <div style={{ color: '#A7C7BC', fontSize: 11, marginTop: 2 }}>
                {suggestion.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation hint */}
      {query && !value && !loading && (
        <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>
          Please select a location from the suggestions
        </p>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LocationPicker;
