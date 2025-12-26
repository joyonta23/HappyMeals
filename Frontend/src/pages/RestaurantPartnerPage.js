import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { apiClient } from '../services/api';

export const RestaurantPartnerPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chattogram'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      // await apiClient.registerPartner(formData);
      alert('Thank you for your interest! Our team will contact you soon.');
      setCurrentPage('home');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const opportunities = [
    {
      icon: '👥',
      title: 'Connect With New Customers',
      description: 'Adding your business to the platform means access to thousands of new customers in different neighbourhoods.'
    },
    {
      icon: '💰',
      title: 'Unlock Revenue',
      description: "Let customers enjoy your business from anywhere, and capture the interest of new ones who haven't tried it yet."
    },
    {
      icon: '🎯',
      title: 'Focus on Your Business',
      description: 'We take care of all the payments and customer support, whilst our happymeal riders take care of the delivery.'
    }
  ];

  const steps = [
    {
      icon: '📱',
      title: 'The Customer Orders',
      description: 'The customer places an order through the happymeal app.'
    },
    {
      icon: '👨‍🍳',
      title: 'You Prepare',
      description: 'You will receive a notification to start preparing the order.'
    },
    {
      icon: '🛵',
      title: 'We Deliver',
      description: 'A happymeal rider will be along shortly to pick up the order and deliver it to the customer.'
    },
    {
      icon: '📈',
      title: 'Watch Your Business Grow',
      description: 'We provide you with insights so you can keep track of your revenue and performance.'
    }
  ];

  const faqs = [
    {
      question: 'Why should I partner with happymeal?',
      answer: 'By signing up as a panda partner, you can grow your business and expand revenue, reach new markets, improve operational efficiency, and get access to marketing tools.'
    },
    {
      question: 'Is my restaurant a good fit for happymeal?',
      answer: 'Your store must be within our operation area, operate at least 4 hours/day and 5 days/week, and have a fixed physical location.'
    },
    {
      question: 'What are the requirements to become a partner?',
      answer: 'You need: National ID Card/Passport, Dine-in Menu, Bank Account Proof, and Trade License (for VAT purposes).'
    },
    {
      question: 'How long does the approval process take?',
      answer: 'The approval process typically takes 2-5 working days, as long as all required documents and details are submitted.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Register your restaurant with us!
            </h1>
            <p className="text-xl mb-8 text-orange-50">
              Sign up easily, showcase your menu, and you can start reaching new customers
            </p>
            <div className="bg-white rounded-lg shadow-2xl p-8 text-gray-800 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Ready to boost your sales?</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Restaurant Name *"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Contact Person Name *"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Restaurant Address *"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Chattogram">Chattogram</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Rajshahi">Rajshahi</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-700 transition"
                >
                  Submit Registration
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">happymeal brings new opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition text-center">
                <div className="text-5xl mb-4">{opp.icon}</div>
                <h3 className="text-xl font-bold mb-3">{opp.title}</h3>
                <p className="text-gray-600">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">We make it simple and easy</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Any questions?</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronRight 
                    size={24} 
                    className={`transform transition ${openFaq === idx ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
