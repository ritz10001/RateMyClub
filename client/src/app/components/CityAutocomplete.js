import { useState, useEffect, useRef } from "react";

export default function CityAutocomplete({ value, onChange, placeholder, className, required }) {
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!inputValue || inputValue.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
            },
            body: JSON.stringify({
              textQuery: `${inputValue} city USA`,
              pageSize: 5,
              locationBias: {
                rectangle: {
                  low: { latitude: 24.396308, longitude: -125.000000 },
                  high: { latitude: 49.384358, longitude: -66.885417 }
                }
              }
            })
          }
        );

        const data = await response.json();
        
        if (data.places) {
          setSuggestions(data.places.map(place => {
            const fullAddress = place.formattedAddress || place.displayName?.text || 'Unknown';
            return fullAddress.replace(/, USA$/, '');
        }));
        } 
        else {
          setSuggestions([]);
        }
      } 
      catch (error) {
        console.error('Places API error:', error);
        setSuggestions([]);
      }
    }, 500);
  };

  // Rest of your component stays the same
  const handleSelect = (city) => {
    onChange(city);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "City, State (e.g., Austin, TX)"}
        className={className}       
        required={required}        
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl mt-1 w-full max-h-60 overflow-auto z-50">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}