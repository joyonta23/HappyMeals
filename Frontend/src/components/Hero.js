import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "../utils/translations";
import { apiClient } from "../services/api";

export const Hero = ({ onSearch, language, restaurants = [], onSelectSuggestion }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const t = useTranslation(language);

  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch(searchQuery);
  };

  // Debounced backend search
  const debounceRef = React.useRef(null);
  const updateSuggestions = (q) => {
    const input = (q || "").trim();
    if (!input || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiClient.search(input);
        setSuggestions(res || []);
        setShowSuggestions(Array.isArray(res) && res.length > 0);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 250);
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {t("heroTitle")}
        </h2>
        <div className="mt-8 max-w-2xl">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchQuery(v);
                  updateSuggestions(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                onFocus={() => updateSuggestions(searchQuery)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {showSuggestions && (
                <div className="absolute left-0 right-0 mt-1 bg-white text-gray-800 rounded shadow z-50 max-h-64 overflow-auto">
                  {suggestions.map((s, idx) => (
                    <div
                      key={`${s.name}-${idx}`}
                      onClick={() => {
                        setSearchQuery(s.name);
                        setShowSuggestions(false);
                        if (typeof onSelectSuggestion === "function") {
                          // pass full suggestion object so parent can decide
                          onSelectSuggestion(s);
                        } else {
                          onSearch(s.name);
                        }
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.restaurant} • {s.cuisine}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Search
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
