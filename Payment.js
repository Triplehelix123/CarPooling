import React, { useState } from 'react';
import './Payment.css';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [amount, setAmount] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!amount) {
      formErrors.amount = 'Amount is required';
    }
    if (!nameOnCard) {
      formErrors.nameOnCard = 'Name on card is required';
    }
    if (cardNumber.length !== 16) {
      formErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (expiration.length !== 4) {
      formErrors.expiration = 'Expiration must be 4 digits (MMYY)';
    }
    if (cvv.length !== 3) {
      formErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Payment Successful!');
    } else {
      alert('Please correct the errors in the form.');
    }
  };

  const banks = [
    "Andhra Bank", "Allahabad Bank", "Bank of Baroda", "Canara Bank", "IDBI Bank", 
    "ICICI Bank", "Indian Overseas Bank", "Punjab National Bank", "South Indian Bank", 
    "State Bank Of India", "City Union Bank", "HDFC Bank", "IndusInd Bank", 
    "Syndicate Bank", "Deutsche Bank", "Corporation Bank", "UCO Bank", 
    "Indian Bank", "Federal Bank", "ING Vysya Bank"
  ];

  return (
    <div className="payment-page">
      <h2>Select Payment Method</h2>
      <div className="payment-methods">
        <div
          className={`payment-option ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('Credit Card')}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/179/179457.png" alt="Credit Card" />
          <p>Credit Card</p>
        </div>
        <div
          className={`payment-option ${paymentMethod === 'Cash Payment' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('Cash Payment')}
        >
          <img src="https://cdn-icons-png.flaticon.com/128/1052/1052866.png" alt="Cash Payment" />
          <p>Cash Payment</p>
        </div>
        <div
          className={`payment-option ${paymentMethod === 'GooglePay' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('GooglePay')}
        >
          <img src="https://cdn-icons-png.flaticon.com/128/6124/6124998.png" alt="GooglePay" />
          <p>Google Pay</p>
        </div>
        <div
          className={`payment-option ${paymentMethod === 'Debit Card' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('Debit Card')}
        >
          <img src="https://cdn-icons-png.flaticon.com/128/13135/13135901.png" alt="Debit Card" />
          <p>Debit Card</p>
        </div>
      </div>

      {paymentMethod === 'GooglePay' ? (
        <div className="qr-code-section">
          <h3>Scan the QR Code to Pay</h3>
          <img
            src="https://w7.pngwing.com/pngs/1006/79/png-transparent-qr-code-qr-code-qr-code-thumbnail.png"
            alt="Google Pay QR Code"
            className="qr-code"
          />
        </div>
      ) : paymentMethod === 'Net Banking' ? (
        <div className="net-banking-section">
          <h2>Net Banking</h2>
          <div className="bank-options">
            {banks.map((bank, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={bank}
                  name="netbanking"
                  value={bank}
                  checked={selectedBank === bank}
                  onChange={() => setSelectedBank(bank)}
                />
                <label htmlFor={bank}>{bank}</label>
              </div>
            ))}
          </div>
          <button className="continue-button" onClick={() => alert(`Selected Bank: ${selectedBank}`)}>
            Continue
          </button>
        </div>
      ) : paymentMethod === 'Cash Payment' ? (
        <div className="cash-payment-section">
          <h3>Thank You for Contributing!</h3>
          <p>Your support is greatly appreciated.</p>
          <button className="feedback-button" onClick={() => alert('Redirecting to Feedback')}>
            Give Feedback
          </button>
        </div>
      ) : (
        <>
          <h2>{paymentMethod} Info</h2>
          <form className="credit-card-form" onSubmit={handleSubmit}>
            <label>Amount</label>
            <input
              type="text"
              placeholder="₹.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <p className="error">{errors.amount}</p>}

            <label>Name on Card</label>
            <input
              type="text"
              placeholder="Enter the name"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
            {errors.nameOnCard && <p className="error">{errors.nameOnCard}</p>}

            <label>Card Number</label>
            <input
              type="text"
              placeholder="Enter 16-digit card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

            <div className="row">
              <div className="column">
                <label>Expiration</label>
                <input
                  type="text"
                  placeholder="MMYY"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                />
                {errors.expiration && <p className="error">{errors.expiration}</p>}
              </div>
              <div className="column">
                <label>CVV Number</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
                {errors.cvv && <p className="error">{errors.cvv}</p>}
              </div>
            </div>

            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
