import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";

type Props = {
  clientSecret: string;
  onClose?: () => void;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  background: "#1a1a1a",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  position: "relative", // ✅ important for close button positioning
};

export default function CheckoutForm({ clientSecret, onClose }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe is not ready yet.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setMessage(result.error.message || "❌ Payment failed.");
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      setMessage("✅ Payment successful!");

      setTimeout(() => {
        onClose?.(); // ✅ closes modal
      }, 1200);

      return;
    }

    setMessage("⏳ Processing payment...");
    setLoading(false);
  };

  return (
    <div
      style={overlayStyle}
      onClick={!loading ? onClose : undefined} // ✅ click outside to close
    >
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()} // ✅ prevent close on inside click
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading} // ✅ prevent closing while paying
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit}>
          <PaymentElement />

          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              background: "#635bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : "Pay"}
          </button>

          {message && (
            <div
              style={{
                marginTop: 12,
                color: message.includes("successful")
                  ? "#4caf50"
                  : "#ff5252",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}