import React from "react";
import "./ComboCard.css";

/**
 * ComboCard Component
 * Displays a meal combo with items and add to cart button
 */
const ComboCard = ({ combo, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(combo);
    }
  };

  return (
    <div className="combo-card">
      <div className="combo-header">
        <h3>কম্বো মিল</h3>
        <span className="combo-price">৳{combo.totalPrice}</span>
      </div>

      <div className="combo-explanation">
        <p>{combo.explanation}</p>
      </div>

      <div className="combo-items">
        <h4>এই কম্বোতে রয়েছে:</h4>
        <ul>
          {combo.items.map((item, idx) => (
            <li key={idx} className="combo-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-price">৳{item.price}</span>
              </div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-thumbnail"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="combo-footer">
        <p className="combo-total">
          মোট মূল্য: <strong>৳{combo.totalPrice}</strong>
        </p>
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
};

export default ComboCard;
