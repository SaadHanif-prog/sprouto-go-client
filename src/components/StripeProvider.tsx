import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripeProvider({ children, clientSecret }: any) {
  return (
   <Elements
  stripe={stripePromise}
  options={{
    clientSecret,
    appearance: {
      theme: "night", // 🔥 switch from "stripe" → "night"
    },
  }}
>
      {children}
    </Elements>
  );
}