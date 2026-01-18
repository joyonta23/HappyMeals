/**
 * Unit Tests for Chatbot Helper Functions
 * Run with: npm test (if Jest is configured) or manually
 */

const {
  parsePriceRange,
  parsePreferences,
  generateCombos,
  filterItemsByPreferences,
  validateInput,
} = require("../utils/chatbotHelper");

// Test Data
const mockMenuItems = [
  {
    _id: "1",
    name: "Hyderabadi Biryani",
    price: 450,
    category: "biryani",
    dietary: ["non-vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 95,
    available: true,
  },
  {
    _id: "2",
    name: "Veg Biryani",
    price: 350,
    category: "biryani",
    dietary: ["vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 85,
    available: true,
  },
  {
    _id: "3",
    name: "Tandoori Chicken",
    price: 400,
    category: "grilled",
    dietary: ["non-vegetarian"],
    spiceLevel: "spicy",
    allergens: ["dairy"],
    isSide: false,
    popularityScore: 90,
    available: true,
  },
  {
    _id: "4",
    name: "Plain Naan",
    price: 80,
    category: "bread",
    dietary: ["vegetarian"],
    spiceLevel: "mild",
    allergens: ["gluten"],
    isSide: true,
    popularityScore: 80,
    available: true,
  },
  {
    _id: "5",
    name: "Masala Chai",
    price: 50,
    category: "drink",
    dietary: ["vegetarian"],
    spiceLevel: "mild",
    allergens: ["dairy"],
    isSide: true,
    popularityScore: 75,
    available: true,
  },
];

// Test Suite
console.log("🧪 Testing Chatbot Helper Functions\n");
console.log("=".repeat(50));

// Test 1: parsePriceRange
console.log("\n1️⃣  Testing parsePriceRange()");
console.log("-".repeat(50));

const testCases = [
  { input: "500-800 tk", expected: { min: 500, max: 800 } },
  { input: "600 to 900", expected: { min: 600, max: 900 } },
  { input: "500", expected: { min: 200, max: 500 } },
  { input: "৳500-800", expected: { min: 500, max: 800 } },
  { input: "", expected: { min: 200, max: 1000 } },
];

testCases.forEach(({ input, expected }) => {
  const result = parsePriceRange(input);
  const passed = result.min === expected.min && result.max === expected.max;
  console.log(`  Input: "${input}"`);
  console.log(`  Result: ${JSON.stringify(result)}`);
  console.log(`  Status: ${passed ? "✅ PASS" : "❌ FAIL"}\n`);
});

// Test 2: parsePreferences
console.log("\n2️⃣  Testing parsePreferences()");
console.log("-".repeat(50));

const prefTests = [
  {
    input: "vegetarian, spicy, love biryani",
    expected: {
      dietary: ["vegetarian"],
      spiceLevel: "spicy",
      keywords: ["biryani"],
    },
  },
  {
    input: "non-veg, mild, no nuts",
    expected: {
      dietary: ["non-vegetarian"],
      spiceLevel: "mild",
      allergensFree: ["nuts"],
    },
  },
  {
    input: "vegan, love pizza and salad",
    expected: {
      dietary: ["vegan"],
      keywords: ["pizza", "salad"],
    },
  },
];

prefTests.forEach(({ input, expected }) => {
  const result = parsePreferences(input);
  console.log(`  Input: "${input}"`);
  console.log(`  Dietary: [${result.dietary.join(", ")}]`);
  console.log(`  Spice Level: ${result.spiceLevel}`);
  console.log(`  Keywords: [${result.keywords.join(", ")}]`);
  console.log(`  Allergen Free: [${result.allergensFree.join(", ")}]\n`);
});

// Test 3: filterItemsByPreferences
console.log("\n3️⃣  Testing filterItemsByPreferences()");
console.log("-".repeat(50));

const filterTest1 = {
  budget: { min: 300, max: 500 },
  prefs: {
    dietary: ["vegetarian"],
    spiceLevel: "medium",
    keywords: [],
    allergensFree: [],
  },
};

const filtered1 = filterItemsByPreferences(
  mockMenuItems,
  filterTest1.prefs,
  filterTest1.budget
);
console.log(`  Budget: ৳${filterTest1.budget.min}-${filterTest1.budget.max}`);
console.log(`  Dietary: ${filterTest1.prefs.dietary.join(", ")}`);
console.log(`  Matching items: ${filtered1.length}`);
filtered1.forEach((item) => {
  console.log(`    - ${item.name} (৳${item.price})`);
});

// Test 4: generateCombos
console.log("\n4️⃣  Testing generateCombos()");
console.log("-".repeat(50));

const comboTest = {
  budget: { min: 400, max: 600 },
  prefs: {
    dietary: [],
    spiceLevel: "medium",
    keywords: ["biryani"],
    allergensFree: [],
  },
};

const combos = generateCombos(
  mockMenuItems,
  comboTest.budget,
  comboTest.prefs,
  3
);

console.log(`  Budget: ৳${comboTest.budget.min}-${comboTest.budget.max}`);
console.log(`  Preferences: ${JSON.stringify(comboTest.prefs)}`);
console.log(`  Generated Combos: ${combos.length}\n`);

combos.forEach((combo, idx) => {
  console.log(`  Combo ${idx + 1}:`);
  console.log(`    Items:`);
  combo.items.forEach((item) => {
    console.log(`      - ${item.name} (${item.category}) @ ৳${item.price}`);
  });
  console.log(`    Total Price: ৳${combo.totalPrice}`);
  console.log(`    Explanation: ${combo.explanation}\n`);
});

// Test 5: validateInput
console.log("\n5️⃣  Testing validateInput()");
console.log("-".repeat(50));

const validationTests = [
  { input: { priceRange: "500-800", preferences: "veg" }, valid: true },
  { input: { priceRange: "", preferences: "veg" }, valid: false },
  { input: { priceRange: "500-800", preferences: "" }, valid: false },
];

validationTests.forEach(({ input, valid }) => {
  const result = validateInput(input);
  console.log(`  Input: ${JSON.stringify(input)}`);
  console.log(`  Valid: ${result.valid ? "✅ YES" : "❌ NO"}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(", ")}`);
  }
  console.log();
});

// Summary
console.log("\n" + "=".repeat(50));
console.log("✅ All tests completed!");
console.log("=".repeat(50) + "\n");

// Export for Jest testing (if needed)
module.exports = {
  parsePriceRange,
  parsePreferences,
  generateCombos,
  filterItemsByPreferences,
  validateInput,
  mockMenuItems,
};
