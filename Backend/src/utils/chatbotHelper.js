/**
 * Chatbot Helper Functions for meal combo generation
 * Provides rule-based parsing and suggestion logic
 */

/**
 * Simple fuzzy match - check if searchText contains most characters of targetWord
 * @param {string} searchText - Text to search in (user input)
 * @param {string} targetWord - Word to match (e.g., "biryani")
 * @returns {boolean} True if it's a likely match
 */
function isFuzzyMatch(searchText, targetWord) {
  // Remove dashes, spaces, underscores from both strings for comparison
  const normalized = searchText.replace(/[-_\s]/g, "");
  const target = targetWord.replace(/[-_\s]/g, "");

  // Check if normalized text contains the target word
  if (normalized.includes(target)) return true;

  // Check partial match - if target is substring of search
  if (
    target.length > 0 &&
    normalized.includes(target.substring(0, Math.ceil(target.length * 0.7)))
  ) {
    return true;
  }

  return false;
}

/**
 * Parse price range from user input (e.g., "500-800 tk" or "500 to 800")
 * @param {string} priceRangeStr - Price range string from user
 * @returns {Object} { min: number, max: number }
 */
function parsePriceRange(priceRangeStr) {
  if (!priceRangeStr || typeof priceRangeStr !== "string") {
    return { min: 200, max: 1000 }; // Default range
  }

  // Remove "tk", "taka", and whitespace
  const cleaned = priceRangeStr
    .toLowerCase()
    .replace(/tk|taka|৳/g, "")
    .trim();

  // Try to extract two numbers
  const numbers = cleaned.match(/\d+/g);

  if (numbers && numbers.length >= 2) {
    const min = parseInt(numbers[0], 10);
    const max = parseInt(numbers[1], 10);
    return { min: Math.min(min, max), max: Math.max(min, max) };
  }

  if (numbers && numbers.length === 1) {
    const price = parseInt(numbers[0], 10);
    // If only one number, assume it's max budget
    return { min: Math.max(0, price - 300), max: price };
  }

  return { min: 200, max: 1000 }; // Default if parsing fails
}

/**
 * Detect dietary preferences from free text
 * @param {string} preferencesStr - User preferences text
 * @returns {Object} { dietary: string[], spiceLevel: string, keywords: string[], rawText: string, allergensFree: string[] }
 */
function parsePreferences(preferencesStr) {
  if (!preferencesStr || typeof preferencesStr !== "string") {
    return {
      dietary: [],
      spiceLevel: "medium",
      keywords: [],
      rawText: "",
      allergensFree: [],
    };
  }

  const text = preferencesStr.toLowerCase();
  const preferences = {
    dietary: [],
    spiceLevel: "medium",
    keywords: [],
    allergensFree: [],
    rawText: text, // Store original text for fallback fuzzy matching
  };

  // Detect dietary preferences
  if (
    text.includes("veg") ||
    text.includes("vegetarian") ||
    text.includes("no meat")
  ) {
    preferences.dietary.push("vegetarian");
  }
  if (
    text.includes("non-veg") ||
    text.includes("non veg") ||
    text.includes("meat") ||
    text.includes("chicken") ||
    text.includes("fish") ||
    text.includes("beef")
  ) {
    preferences.dietary.push("non-vegetarian");
  }
  if (text.includes("vegan")) {
    preferences.dietary.push("vegan");
  }
  if (text.includes("halal")) {
    preferences.dietary.push("halal");
  }

  // Detect spice level
  if (text.includes("spicy") || text.includes("hot")) {
    preferences.spiceLevel = "spicy";
  } else if (text.includes("mild") || text.includes("not spicy")) {
    preferences.spiceLevel = "mild";
  } else if (text.includes("medium")) {
    preferences.spiceLevel = "medium";
  }

  // Detect allergen preferences (what to avoid)
  if (text.includes("no nuts") || text.includes("nut free")) {
    preferences.allergensFree.push("nuts");
  }
  if (text.includes("no dairy") || text.includes("dairy free")) {
    preferences.allergensFree.push("dairy");
  }
  if (text.includes("no gluten") || text.includes("gluten free")) {
    preferences.allergensFree.push("gluten");
  }
  if (text.includes("no shellfish")) {
    preferences.allergensFree.push("shellfish");
  }
  if (text.includes("no eggs") || text.includes("egg free")) {
    preferences.allergensFree.push("eggs");
  }

  // Extract favorite dish keywords
  const favoriteKeywords = [
    "biryani",
    "biriyani",
    "pizza",
    "burger",
    "fries",
    "salad",
    "naan",
    "rice",
    "curry",
    "grilled",
    "fried",
    "pasta",
    "roti",
    "kebab",
    "wrap",
    "sandwich",
    "chicken",
    "beef",
    "mutton",
    "fish",
    "shrimp",
    "prawn",
    "shwarma",
    "shawarma",
    "kacchi",
    "tehari",
    "polao",
    "khichuri",
  ];
  favoriteKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      preferences.keywords.push(keyword);
    }
  });

  return preferences;
}

/**
 * Build meal combos using greedy algorithm
 * @param {Array} availableItems - List of menu items from MongoDB
 * @param {Object} priceRange - { min, max }
 * @param {Object} userPreferences - { dietary, spiceLevel, keywords, allergensFree }
 * @param {number} comboCount - Number of combos to generate (default 3)
 * @returns {Array} Array of combos: [{ items: [...], totalPrice, explanation }]
 */
function generateCombos(
  availableItems,
  priceRange,
  userPreferences,
  comboCount = 3
) {
  if (!availableItems || availableItems.length === 0) {
    return [];
  }

  // Step 1: Filter items based on preferences and budget
  const filtered = filterItemsByPreferences(
    availableItems,
    userPreferences,
    priceRange
  );

  console.log(`After filtering: ${filtered.length} items match preferences`);
  console.log(
    "Filtered items:",
    filtered.map((item) => ({
      name: item.name,
      category: item.category,
      price: item.price,
    }))
  );

  if (filtered.length === 0) {
    return [];
  }

  // Step 2: Separate main dishes and sides
  const mainDishes = filtered
    .filter((item) => !item.isSide)
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
  const sides = filtered.filter((item) => item.isSide);

  console.log(`Main dishes: ${mainDishes.length}, Sides: ${sides.length}`);

  if (mainDishes.length === 0) {
    return [];
  }

  // Step 3: Generate combos using greedy algorithm
  const combos = [];
  const usedMainDishes = new Set();

  for (let i = 0; i < comboCount && mainDishes.length > 0; i++) {
    // Pick a main dish that hasn't been used in a combo
    let mainDish = null;
    for (const dish of mainDishes) {
      if (!usedMainDishes.has(dish._id.toString())) {
        mainDish = dish;
        usedMainDishes.add(dish._id.toString());
        break;
      }
    }

    if (!mainDish) {
      break; // No more unique main dishes
    }

    const comboItems = [mainDish];
    let totalPrice = mainDish.price;
    const budgetRemaining = priceRange.max - totalPrice;

    // Add compatible sides (greedy: highest popularity first)
    const compatibleSides = sides
      .filter((side) => !comboItems.some((item) => item._id === side._id))
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));

    for (const side of compatibleSides) {
      if (totalPrice + side.price <= priceRange.max) {
        comboItems.push(side);
        totalPrice += side.price;
      }
    }

    // Only include combos with at least 2 items and within budget
    // Include combos with at least 1 item within budget
    // Allow single-item combos when budget is tight
    if (comboItems.length >= 1 && totalPrice <= priceRange.max) {
      const explanation = generateComboExplanation(comboItems, userPreferences);
      combos.push({
        items: comboItems.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          isSide: item.isSide,
          description: item.description,
          image: item.image,
        })),
        totalPrice,
        explanation,
      });
    }
  }

  return combos;
}

/**
 * Filter menu items based on user preferences
 * @param {Array} items - Menu items
 * @param {Object} preferences - User preferences
 * @param {Object} priceRange - Price range
 * @returns {Array} Filtered items
 */
function filterItemsByPreferences(items, preferences, priceRange) {
  console.log("=== filterItemsByPreferences DEBUG ===");
  console.log("Total items:", items.length);
  console.log("Price range:", priceRange);
  console.log("User preferences:", preferences);
  if (items.length > 0) {
    console.log("Sample item:", {
      name: items[0].name,
      price: items[0].price,
      category: items[0].category,
      dietary: items[0].dietary,
      available: items[0].available,
    });
  }

  // PRIORITY 1: If user mentioned specific keywords (e.g., "chicken biryani"),
  // show matching items with RELAXED budget (±50 of original budget)
  if (preferences.keywords && preferences.keywords.length > 0) {
    console.log("Checking for keyword matches with relaxed budget...");
    const relaxedMin = Math.max(0, priceRange.min - 50);
    const relaxedMax = priceRange.max + 100; // More relaxed on upper end

    const keywordMatched = items.filter((item) => {
      // More relaxed price filter for keyword matches
      if (item.price < relaxedMin || item.price > relaxedMax) {
        return false;
      }

      // Must match at least one keyword (name, category, or description)
      const hasMatchingKeyword = preferences.keywords.some(
        (keyword) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(keyword.toLowerCase())) ||
          (item.description &&
            item.description.toLowerCase().includes(keyword.toLowerCase()))
      );

      if (!hasMatchingKeyword) {
        return false;
      }

      // Dietary filter (if specified)
      if (preferences.dietary && preferences.dietary.length > 0) {
        const hasDietaryMatch = preferences.dietary.some((pref) => {
          if (!item.dietary || item.dietary.length === 0) {
            return true;
          }
          return item.dietary.some(
            (itemDiet) => itemDiet.toLowerCase() === pref.toLowerCase()
          );
        });
        if (!hasDietaryMatch) {
          return false;
        }
      }

      // Allergen filter
      if (preferences.allergensFree && preferences.allergensFree.length > 0) {
        const hasAllergen = preferences.allergensFree.some(
          (allergen) => item.allergens && item.allergens.includes(allergen)
        );
        if (hasAllergen) {
          return false;
        }
      }

      // Availability filter
      if (item.available === false) {
        return false;
      }

      return true;
    });

    console.log("Keyword matches with relaxed budget:", keywordMatched.length);
    if (keywordMatched.length > 0) {
      return keywordMatched;
    }
  }

  // PRIORITY 2: Strict filtering with budget + dietary (no keywords)
  console.log("Trying strict filter (budget + dietary)...");
  const strictFiltered = items.filter((item) => {
    // Price filter - standard range
    if (
      item.price < priceRange.min * 0.2 ||
      item.price > priceRange.max * 1.3
    ) {
      return false;
    }

    // Dietary filter (if specified)
    if (preferences.dietary && preferences.dietary.length > 0) {
      const hasDietaryMatch = preferences.dietary.some((pref) => {
        if (!item.dietary || item.dietary.length === 0) {
          return true;
        }
        return item.dietary.some(
          (itemDiet) => itemDiet.toLowerCase() === pref.toLowerCase()
        );
      });
      if (!hasDietaryMatch) {
        return false;
      }
    }

    // Allergen filter
    if (preferences.allergensFree && preferences.allergensFree.length > 0) {
      const hasAllergen = preferences.allergensFree.some(
        (allergen) => item.allergens && item.allergens.includes(allergen)
      );
      if (hasAllergen) {
        return false;
      }
    }

    // Availability filter
    if (item.available === false) {
      return false;
    }

    return true;
  });

  console.log("Strict filter results:", strictFiltered.length);
  if (strictFiltered.length > 0) {
    return strictFiltered;
  }

  // PRIORITY 3: Fuzzy match on raw text with budget
  if (preferences.rawText && preferences.rawText.length > 0) {
    console.log("Trying fuzzy match with rawText:", preferences.rawText);
    const relaxedMin = Math.max(0, priceRange.min - 50);
    const relaxedMax = priceRange.max + 100;

    const fuzzyFiltered = items.filter((item) => {
      // Relaxed price filter for fuzzy matches
      if (item.price < relaxedMin || item.price > relaxedMax) {
        return false;
      }

      // Fuzzy match on raw text
      const itemName = (item.name || "").toLowerCase();
      const itemDesc = (item.description || "").toLowerCase();
      const userInput = preferences.rawText.toLowerCase();
      const normalizedInput = userInput.replace(/[-_\s]/g, "");

      const nameMatch =
        isFuzzyMatch(normalizedInput, itemName.replace(/[-_\s]/g, "")) ||
        itemName.includes(normalizedInput);
      const descMatch = itemDesc.includes(normalizedInput);

      if (nameMatch || descMatch) {
        // Dietary filter
        if (preferences.dietary && preferences.dietary.length > 0) {
          const hasDietaryMatch = preferences.dietary.some((pref) => {
            if (!item.dietary || item.dietary.length === 0) {
              return true;
            }
            return item.dietary.some(
              (itemDiet) => itemDiet.toLowerCase() === pref.toLowerCase()
            );
          });
          if (!hasDietaryMatch) {
            return false;
          }
        }

        // Allergen filter
        if (preferences.allergensFree && preferences.allergensFree.length > 0) {
          const hasAllergen = preferences.allergensFree.some(
            (allergen) => item.allergens && item.allergens.includes(allergen)
          );
          if (hasAllergen) {
            return false;
          }
        }

        if (item.available === false) {
          return false;
        }

        return true;
      }

      return false;
    });

    console.log("Fuzzy filter results:", fuzzyFiltered.length);
    if (fuzzyFiltered.length > 0) {
      return fuzzyFiltered;
    }
  }

  // PRIORITY 4: Just return anything within relaxed budget (last resort)
  console.log("Falling back to budget-only filter with relaxed range");
  const relaxedMin = Math.max(0, priceRange.min - 50);
  const relaxedMax = priceRange.max + 100;

  return items.filter((item) => {
    // Relaxed price filter
    if (item.price < relaxedMin || item.price > relaxedMax) {
      return false;
    }

    // Availability filter
    if (item.available === false) {
      return false;
    }

    return true;
  });
}

/**
 * Generate a conversational explanation for a combo
 * @param {Array} items - Items in combo
 * @param {Object} preferences - User preferences
 * @returns {string} Explanation text
 */
function generateComboExplanation(items, preferences) {
  const mainDish = items.find((item) => !item.isSide);
  const sides = items.filter((item) => item.isSide);

  let explanation = `এই কম্বো আপনার জন্য নিখুঁত! আমরা ${mainDish?.name || "একটি সুস্বাদু মূল খাবার"}`;

  if (preferences.spiceLevel) {
    explanation += ` (${preferences.spiceLevel})`;
  }

  if (sides.length > 0) {
    explanation += ` নির্বাচন করেছি, এর সাথে ${sides
      .map((s) => s.name)
      .join(", ")}`;
  }

  explanation += "। আপনার বাজেটের মধ্যে একটি সম্পূর্ণ খাবার!";

  return explanation;
}

/**
 * Validate user input
 * @param {Object} input - { priceRange, preferences }
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateInput(input) {
  const errors = [];

  if (!input.priceRange || typeof input.priceRange !== "string") {
    errors.push("দয়া করে একটি বৈধ মূল্য পরিসীমা প্রদান করুন");
  }

  if (!input.preferences || typeof input.preferences !== "string") {
    errors.push("দয়া করে আপনার পছন্দগুলি বর্ণনা করুন");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  parsePriceRange,
  parsePreferences,
  generateCombos,
  filterItemsByPreferences,
  generateComboExplanation,
  validateInput,
};
