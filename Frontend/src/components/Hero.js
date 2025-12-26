import React, { useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "../utils/translations";

export const Hero = ({ onSearch, language }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslation(language);

  const handleSearch = () => {
    onSearch(searchQuery);
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
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
