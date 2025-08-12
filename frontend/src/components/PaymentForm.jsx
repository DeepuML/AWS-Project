import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    // In a real implementation, you would create a payment intent on your server
    // and pass the client secret to the client. For demo purposes, we're skipping that step.
    // const clientSecret = await fetchPaymentIntentClientSecret();

    // For demo purposes, we'll simulate a successful payment
    setTimeout(async () => {
      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setSucceeded(true);
        setProcessing(false);
        // Call the onSuccess callback with the payment method ID
        onSuccess(payload.paymentMethod.id);
      }
    }, 2000);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };

  return (
    <div className="payment-form-container">
      <h2>Payment Details</h2>
      <p className="payment-amount">Amount: ${amount}</p>
      
      {succeeded ? (
        <div className="payment-success">
          <i className="fas fa-check-circle"></i>
          <p>Payment successful!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Information</label>
            <div className="card-element-container">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
          
          {error && <div className="payment-error">{error}</div>}
          
          <div className="payment-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={processing}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!stripe || processing}
            >
              {processing ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;