import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "SautiAI - AI-Powered Debt Collection Platform",
    "description": "Transform your debt collection with AI. Recover 65% more outstanding payments with automated calls and smart collection strategies.",
    "url": "https://sautiai.com",
    "mainEntity": {
      "@type": "Organization",
      "name": "SautiAI",
      "description": "AI-powered debt collection platform"
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
        title="SautiAI - AI-Powered Debt Collection Platform | Recover 65% More Outstanding Payments"
        description="Transform your debt collection with SautiAI's AI-powered platform. Automate calls, increase recovery rates by 65%, and streamline your collection process. Book a free demo today."
        keywords="debt collection, AI debt collection, automated collections, payment recovery, debt management software, collection automation, SautiAI, fintech, debt recovery AI, automated debt collection"
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
