import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { toast } from 'react-toastify';
import './Checkout.css';

// Replace with your own publishable key from the Stripe Dashboard
// For demo purposes, we're using the test key
const stripePromise = loadStripe('pk_test_51OxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would get this data from the previous page or an API
    // For demo purposes, we'll use state or query params
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan') || 'Premium';
    
    // Simulate loading order data
    setTimeout(() => {
      const planDetails = {
        Basic: { name: 'Basic Plan', price: 29.99 },
        Premium: { name: 'Premium Plan', price: 49.99 },
        Elite: { name: 'Elite Plan', price: 79.99 }
      };
      
      setOrderSummary({
        plan: planDetails[plan].name,
        price: planDetails[plan].price,
        tax: parseFloat((planDetails[plan].price * 0.08).toFixed(2)),
        total: parseFloat((planDetails[plan].price * 1.08).toFixed(2))
      });
      
      setLoading(false);
    }, 1000);
  }, [location]);

  const handlePaymentSuccess = (paymentMethodId) => {
    // In a real application, you would send the payment method ID to your server
    // to complete the payment. For demo purposes, we'll just show a success message.
    toast.success('Payment successful! Your membership is now active.');
    
    // Redirect to a success page or dashboard
    setTimeout(() => {
      navigate('/membership');
    }, 2000);
  };

  const handleCancel = () => {
    if (showPaymentForm) {
      setShowPaymentForm(false);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading checkout information...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your membership purchase</p>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Plan:</span>
            <span>{orderSummary.plan}</span>
          </div>
          <div className="summary-item">
            <span>Price:</span>
            <span>${orderSummary.price.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>${orderSummary.tax.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>

          {!showPaymentForm && (
            <button 
              className="btn btn-primary full-width" 
              onClick={() => setShowPaymentForm(true)}
            >
              Proceed to Payment
            </button>
          )}
        </div>

        {showPaymentForm && (
          <div className="payment-section">
            <Elements stripe={stripePromise}>
              <PaymentForm 
                amount={orderSummary.total.toFixed(2)} 
                onSuccess={handlePaymentSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;