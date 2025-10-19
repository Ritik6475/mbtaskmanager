import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductActionModal = ({ open, onClose, mode, productId, quantity, price, address }) => {
  const [qty, setQty] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(price);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setTotalPrice(price * qty);
  }, [qty, price]);

  if (!open) return null;

  const increaseQty = () => setQty(prev => prev + 1);
  const decreaseQty = () => setQty(prev => (prev > 1 ? prev - 1 : 1));

  const handleAction = async () => {
    try {
      if (mode === "buy") {
        const createRes = await axios.post("http://localhost:5000/payments/create", {
          userId,
          items: [{ product: productId, quantity: qty, price }],
          totalPrice,
        });

        const { razorpayOrderId, amount, currency } = createRes.data;

        const options = {
          key: "rzp_test_PDH8JokGIvkPbl",
          amount,
          currency,
          name: "My Store",
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              await axios.post("http://localhost:5000/payments/verify-and-save", {
                userId,
                items: [{ product: productId, quantity: qty, price }],
                totalPrice,
                address,
                paymentMethod: "card",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              alert("Payment successful!");
            } catch (err) {
              console.error(err);
              alert("Payment verification failed!");
            }
          },
          prefill: { name: "Test User", email: "test@example.com" },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await axios.post("http://localhost:5000/cart", {
          userId,
          productId,
          quantity: qty,
          price: totalPrice,
        });
        alert("Product added to cart!");
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again!");
    }
  };

  // --- Inline styles ---
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const modalStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px",
    width: "90%",
    maxWidth: "450px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    background: "transparent",
  };

  const qtyBtnStyle = {
    padding: "6px 12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
  };

  const actionBtnStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: mode === "buy" ? "#4caf50" : "#2196f3",
    color: "#fff",
    width: "100%",
    transition: "background-color 0.2s",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        <h3 style={{ marginBottom: "15px" }}>{mode === "buy" ? "Buy Product" : "Add to Cart"}</h3>
        <p><strong>Product ID:</strong> {productId}</p>
        <p><strong>Unit Price:</strong> ₹{price.toFixed(2)}</p>

        <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
          <button style={qtyBtnStyle} onClick={decreaseQty}>-</button>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            style={{
              width: "50px",
              textAlign: "center",
              margin: "0 10px",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button style={qtyBtnStyle} onClick={increaseQty}>+</button>
        </div>

        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
          Total Price: ₹{totalPrice.toFixed(2)}
        </p>

        <button style={actionBtnStyle} onClick={handleAction}>
          {mode === "buy" ? "Proceed to Buy" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductActionModal;
