import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import TermsOfService from "./components/TermsAndCondition.tsx";
import PrivacyPolicy from "./components/PrivacyPolicy.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import store from "./global-states/store.ts";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          
          <Routes>
            <Route path="/" element={<App />} />
            <Route 
              path="/privacy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms" 
              element={<TermsOfService />} 
            />
            <Route 
              path="/reset-password/:id" 
              element={<ResetPassword />} 
            />
          </Routes>

          <Toaster />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);