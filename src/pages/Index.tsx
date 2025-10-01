import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated && !isLoading) {
      console.log('Index: User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Send page view to Google Tag Manager
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GTM-W4PM23HN', {
        page_title: 'SautiAI Homepage',
        page_location: window.location.href,
      });
    }
    
    // Send custom event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'SautiAI Homepage',
        page_location: window.location.href,
        page_type: 'homepage'
      });
    }
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "SautiAI - AI-Powered Call Centre Platform",
    "description": "Transform your Call Centre with AI. Recover 65% more outstanding payments with automated calls and smart collection strategies.",
    "url": "https://sautiai.com",
    "mainEntity": {
      "@type": "Organization",
      "name": "SautiAI",
      "description": "AI-powered Call Centre platform"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sautiai.com"
        }
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="SautiAI - AI-Powered Call Centre Platform | Recover 65% More Outstanding Payments"
        description="Transform your Call Centre with SautiAI's AI-powered platform. Automate calls, increase recovery rates by 65%, and streamline your collection process. Book a free demo today."
        keywords="Call Centre, AI Call Centre, automated collections, payment recovery, debt management software, collection automation, SautiAI, fintech, debt recovery AI, automated Call Centre"
        url="https://sautiai.com"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <FAQ />
        <Footer />
      </div>
    </>
  );
};

export default Index;
