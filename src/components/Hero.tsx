
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
    <section id="hero-form" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-20 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              🤖 AI-Powered Debt Collection
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Let AI Collect Your Debts — The Smart Way
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Collect 50% of your account receivables in 20 days. Let AI handle the conversations while you focus on growing your business.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-sm text-gray-500">Higher Collection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">20 Days</div>
                <div className="text-sm text-gray-500">Average Collection Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">99%</div>
                <div className="text-sm text-gray-500">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right - Phone Mockup */}
          <div className="flex justify-center">
            <PhoneMockup 
              isLoading={isLoading} 
              phoneNumber={phoneNumber}
              email={email}
              onPhoneChange={setPhoneNumber}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-8">Trusted by 500+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            <div className="text-lg font-semibold text-gray-700">Uber Freight</div>
            <div className="text-lg font-semibold text-blue-600">deel.</div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">KM</div>
            <div className="text-lg font-semibold text-gray-700">CLIPBOARD HEALTH</div>
            <div className="text-lg font-semibold text-red-500 italic">Redis</div>
            <div className="text-lg font-semibold text-gray-700">Stripe</div>
            <div className="text-lg font-semibold text-green-600">Shopify</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
