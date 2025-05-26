
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PhoneMockup from "./PhoneMockup";

const Hero = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^\+?[\d\s-()]+$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid work email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success! 🎉",
        description: "DebAI will call you within 2 minutes",
      });
      setPhoneNumber("");
      setEmail("");
    }, 2000);
  };

  return (
    <section id="hero-form" className="min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl text-center">
        {/* Main Headlines */}
        <div className="mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-sm font-medium mb-12">
            🤖 AI-Powered Debt Collection
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-12 leading-tight max-w-5xl mx-auto">
            Let AI Collect Your Debts — The Smart Way
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Collect 50% of your account receivables in 20 days. Let AI handle the conversations while you focus on growing your business.
          </p>
          
          
        </div>

        {/* Phone Mockup with Form */}
        <div className="mb-24">
          <PhoneMockup 
            isLoading={isLoading} 
            phoneNumber={phoneNumber}
            email={email}
            onPhoneChange={setPhoneNumber}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <p className="text-lg text-gray-500 mb-10">Trusted by 500+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-12 lg:gap-16 flex-wrap opacity-60">
            <div className="text-xl font-semibold text-gray-700">Uber Freight</div>
            <div className="text-xl font-semibold text-blue-600">deel.</div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">KM</div>
            <div className="text-xl font-semibold text-gray-700">CLIPBOARD HEALTH</div>
            <div className="text-xl font-semibold text-red-500 italic">Redis</div>
            <div className="text-xl font-semibold text-gray-700">Stripe</div>
            <div className="text-xl font-semibold text-green-600">Shopify</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
            <div className="text-5xl font-bold text-blue-600 mb-4">50%</div>
            <div className="text-lg text-gray-600">Higher Collection Rate</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
            <div className="text-5xl font-bold text-purple-600 mb-4">20 Days</div>
            <div className="text-lg text-gray-600">Average Collection Time</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
            <div className="text-5xl font-bold text-indigo-600 mb-4">99%</div>
            <div className="text-lg text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
