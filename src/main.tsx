import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import store from "./global-states/store.ts";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // ✅ add this
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
        <Toaster /> 
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);