
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
    <section id="hero-form" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Main Headlines */}
        <div className="mb-8">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🤖 AI-Powered Debt Collection
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Let AI Collect Your Debts — The Smart Way
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Collect 50% of your account receivables in 20 days. Let AI handle the conversations while you focus on growing your business.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              Watch Demo Video
            </Button>
          </div>
        </div>

        {/* Phone Mockup with Form */}
        <div className="mb-16">
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
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-6">Trusted by 500+ businesses</p>
          <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap opacity-60">
            <div className="text-lg font-semibold text-gray-700">Uber Freight</div>
            <div className="text-lg font-semibold text-blue-600">deel.</div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">KM</div>
            <div className="text-lg font-semibold text-gray-700">CLIPBOARD HEALTH</div>
            <div className="text-lg font-semibold text-red-500 italic">Redis</div>
            <div className="text-lg font-semibold text-gray-700">Stripe</div>
            <div className="text-lg font-semibold text-green-600">Shopify</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
            <div className="text-gray-600">Higher Collection Rate</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">20 Days</div>
            <div className="text-gray-600">Average Collection Time</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-indigo-600 mb-2">99%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
