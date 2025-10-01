import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BookCall from "./pages/BookCall";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Transcriptions from "./pages/Transcriptions";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";
import { FloatingHelpButton } from "./components/ui/help-button";
import { AuthProvider } from "./contexts/AuthContext";
import { SessionTracker } from "./components/SessionTracker";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SessionTracker />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<><Index /><FloatingHelpButton /></>} />
                <Route path="/book-call" element={<><BookCall /><FloatingHelpButton /></>} />
                <Route path="/pricing" element={<><Pricing /><FloatingHelpButton /></>} />
                <Route path="/transcriptions" element={<><Transcriptions /><FloatingHelpButton /></>} />
                <Route path="/blogs" element={<><Blogs /><FloatingHelpButton /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
              />
              
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
