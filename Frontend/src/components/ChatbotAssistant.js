import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ComboCard from "./ComboCard";
import "./ChatbotAssistant.css";

/**
 * ChatbotAssistant Component
 * AI-powered meal combo suggestion chatbot
 * Custom implementation compatible with React 19
 */

const ChatbotAssistant = ({
  restaurantId = null,
  onAddToCart = null,
  onClose = null,
}) => {
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 I'm here to help you select your meal. What's your budget? (e.g., 500-800 Taka)",
    },
  ]);
  const [priceRange, setPriceRange] = useState("");
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, text) => {
    setMessages((prev) => [...prev, { type, text }]);
  };

  const getText = (en, bn) => (language === "en" ? en : bn);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "bn" : "en";
    setLanguage(newLang);

    // Update initial greeting message when language changes
    if (step === 1 && messages.length === 1) {
      setMessages([
        {
          type: "bot",
          text:
            newLang === "en"
              ? "Hello! 👋 I'm here to help you select your meal. What's your budget? (e.g., 500-800 Taka)"
              : "নমস্কার! 👋 আমি আপনার খাবার নির্বাচনে সাহায্য করতে এখানে আছি। আপনার বাজেট কত? (যেমন: 500-800 টাকা)",
        },
      ]);
    }
  };

  const generateCombos = async (priceRangeInput, preferencesInput) => {
    try {
      const payload = {
        priceRange: priceRangeInput,
        preferences: preferencesInput,
        ...(restaurantId && { restaurantId }),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/chatbot/generate-combo`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("Error generating combos:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    addMessage("user", inputValue);

    if (step === 1) {
      // Price range step
      setPriceRange(inputValue);
      setInputValue("");
      addMessage(
        "bot",
        getText(
          'Great! Now tell me your food preferences. For example: "Vegetarian, mild spice, love biryani" or "Beef, very spicy"',
          'চমৎকার! এখন আপনার খাবারের পছন্দ বলুন। উদাহরণস্বরূপ: "নিরামিষ, হালকা মসলাযুক্ত, বিরিয়ানি পছন্দ করি" বা "গরুর মাংস, খুব মসলাযুক্ত"'
        )
      );
      setStep(2);
    } else if (step === 2) {
      // Preferences step
      const userPreferences = inputValue;
      setInputValue("");
      addMessage("bot", getText("Thinking...", "চিন্তা করছি..."));
      setLoading(true);
      setStep(3);

      // Generate combos
      try {
        const response = await generateCombos(priceRange, userPreferences);

        setLoading(false);

        // Remove "thinking" message
        setMessages((prev) => prev.slice(0, -1));

        if (response.success && response.combos.length > 0) {
          setCombos(response.combos);
          const successMsg =
            language === "en"
              ? `We found ${response.combos.length} amazing combo${response.combos.length > 1 ? "s" : ""} for you!`
              : `আমরা আপনার জন্য ${response.combos.length}টি দুর্দান্ত কম্বো খুঁজে পেয়েছি!`;
          addMessage("bot", successMsg);
          setStep(4);
        } else {
          const failMsg =
            language === "en"
              ? "Sorry, no combos found matching your preferences. Please adjust your preferences."
              : "দুঃখিত, আপনার পছন্দের জন্য কোন কম্বো খুঁজে পাওয়া যায়নি। দয়া করে আপনার পছন্দগুলি সামঞ্জস্য করুন।";
          addMessage("bot", failMsg);
          const retryMsg =
            language === "en"
              ? "Want to try again? Enter a new budget or click the X."
              : "আবার চেষ্টা করতে চান? নতুন বাজেট লিখুন অথবা X চিহ্নে ক্লিক করুন।";
          addMessage("bot", retryMsg);
          setStep(1);
          setPriceRange("");
        }
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        setLoading(false);
        setMessages((prev) => prev.slice(0, -1));
        const errorMsg =
          language === "en"
            ? "Error creating combos. Please try again later."
            : "কম্বো তৈরিতে ত্রুটি হয়েছে। দয়া করে পরে চেষ্টা করুন।";
        addMessage("bot", errorMsg);
        setStep(1);
        setPriceRange("");
      }
    }
  };

  const handleRestart = () => {
    setStep(1);
    setPriceRange("");
    setCombos([]);
    setInputValue("");
    const greeting =
      language === "en"
        ? "Hello! 👋 I'm here to help you select your meal. What's your budget? (e.g., 500-800 Taka)"
        : "নমস্কার! 👋 আমি আপনার খাবার নির্বাচনে সাহায্য করতে এখানে আছি। আপনার বাজেট কত? (যেমন: 500-800 টাকা)";
    setMessages([{ type: "bot", text: greeting }]);
  };

  const handleAddCombo = (combo) => {
    if (onAddToCart) {
      onAddToCart(combo);
    }
    const cartMsg =
      language === "en"
        ? "Combo added to cart! Need anything else?"
        : "কম্বো কার্টে যোগ করা হয়েছে! আরও কিছু সাহায্যের প্রয়োজন?";
    addMessage("bot", cartMsg);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>{getText("Food Assistant 🤖", "খাবার সহায়ক 🤖")}</h3>
        <div className="header-actions">
          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={getText("Switch to Bengali", "Switch to English")}
          >
            {language === "en" ? "বাং" : "EN"}
          </button>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}-message`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}

        {/* Display combos */}
        {step === 4 && combos.length > 0 && (
          <div className="combos-container">
            {combos.map((combo, idx) => (
              <ComboCard key={idx} combo={combo} onAddToCart={handleAddCombo} />
            ))}
          </div>
        )}

        {loading && (
          <div className="message bot-message">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {step !== 4 && step !== 3 && (
        <form className="chatbot-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              step === 1 ? "উদাহরণ: 500-800 টাকা" : "আপনার পছন্দ লিখুন..."
            }
            className="chatbot-input-field"
            disabled={loading}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={loading || !inputValue.trim()}
          >
            ↑
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="chatbot-actions">
          <button onClick={handleRestart} className="restart-btn">
            {getText("Start Over", "পুনরায় শুরু করুন")}
          </button>
          {onClose && (
            <button onClick={onClose} className="close-action-btn">
              {getText("Close Chat", "চ্যাট বন্ধ করুন")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotAssistant;
