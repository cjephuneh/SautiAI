
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
      <div id="pricing">
        {/* Placeholder for future pricing section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 mb-8">Choose the plan that works for your business</p>
            <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg">
              <h3 className="text-xl font-bold mb-4">Pay Per Success</h3>
              <p className="text-gray-600 mb-6">Only pay when we successfully collect</p>
              <div className="text-3xl font-bold text-blue-600 mb-4">15%</div>
              <p className="text-sm text-gray-500">of amount collected</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
