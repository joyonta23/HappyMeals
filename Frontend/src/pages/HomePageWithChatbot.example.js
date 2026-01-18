/**
 * EXAMPLE: How to integrate ChatbotAssistant into HomePage
 * This is a reference implementation - modify as needed for your app
 */

import React, { useState } from "react";
import ChatbotAssistant from "../components/ChatbotAssistant";
import "./HomePageWithChatbot.css";

/**
 * Example HomePage with integrated AI Chatbot
 * Shows how to:
 * 1. Toggle chatbot visibility
 * 2. Handle combo additions to cart
 * 3. Display chatbot in modal
 */
const HomePageWithChatbotExample = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);

  /**
   * Handle when user adds a combo to cart
   * This should integrate with your cart context/Redux
   */
  const handleAddComboToCart = (combo) => {
    console.log("Combo added to cart:", combo);

    // Example: Add combo items to cart
    // You would replace this with your actual cart logic
    // Example using context:
    // const { addToCart } = useContext(CartContext);
    // combo.items.forEach(item => {
    //   addToCart({
    //     ...item,
    //     quantity: 1,
    //     fromCombo: true,
    //     comboId: combo._id
    //   });
    // });

    // Show success notification
    setCartNotification({
      message: `${combo.items.length}টি আইটেম কার্টে যোগ হয়েছে!`,
      type: "success",
    });

    setTimeout(() => setCartNotification(null), 3000);
  };

  /**
   * Handle closing chatbot
   */
  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  return (
    <div className="home-page-with-chatbot">
      {/* Existing HomePage content would go here */}

      {/* Chatbot Toggle Button - Fixed position */}
      <button
        className="chatbot-toggle-btn"
        onClick={() => setShowChatbot(!showChatbot)}
        title="খাবার সহায়ক খুলুন"
      >
        <span className="chatbot-icon">🤖</span>
        <span className="chatbot-text">খাবার সহায়ক</span>
      </button>

      {/* Chatbot Modal/Overlay */}
      {showChatbot && (
        <div className="chatbot-overlay">
          <div className="chatbot-wrapper">
            <ChatbotAssistant
              restaurantId={null} // Set to specific restaurant ID if needed
              onAddToCart={handleAddComboToCart}
              onClose={handleCloseChatbot}
            />
          </div>
        </div>
      )}

      {/* Cart Notification */}
      {cartNotification && (
        <div className={`notification notification-${cartNotification.type}`}>
          {cartNotification.message}
        </div>
      )}
    </div>
  );
};

export default HomePageWithChatbotExample;

/**
 * INTEGRATION STEPS:
 *
 * 1. Import the component in your HomePage:
 *    import ChatbotAssistant from "../components/ChatbotAssistant";
 *
 * 2. Add state for chatbot visibility:
 *    const [showChatbot, setShowChatbot] = useState(false);
 *
 * 3. Add a toggle button:
 *    <button onClick={() => setShowChatbot(!showChatbot)}>
 *      🤖 খাবার সহায়ক
 *    </button>
 *
 * 4. Conditionally render chatbot:
 *    {showChatbot && (
 *      <ChatbotAssistant
 *        onAddToCart={handleAddToCart}
 *        onClose={() => setShowChatbot(false)}
 *      />
 *    )}
 *
 * 5. Handle cart integration in handleAddComboToCart
 */
