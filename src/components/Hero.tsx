
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
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success! 🎉",
        description: "DebtAI will call you within 2 minutes",
      });
      setPhoneNumber("");
      setEmail("");
    }, 2000);
  };

  return (
    <section id="hero-form" className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-10">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold shadow-sm">
              🤖 AI-Powered Debt Collection Platform
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 leading-tight tracking-tight">
                Let AI Collect Your Debts — 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  The Smart Way
                </span>
              </h1>
              
              <p className="text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Recover 65% more outstanding payments in half the time. DebtAI handles conversations naturally while you focus on growing your business.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">65%</div>
                <div className="text-sm text-gray-600 font-medium">Higher Recovery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">15 Days</div>
                <div className="text-sm text-gray-600 font-medium">Average Collection Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Automated Outreach</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => document.querySelector('#hero-form')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
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
        <div className="mt-24 text-center">
          <p className="text-gray-500 mb-12 text-lg">Trusted by 1,200+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-16 flex-wrap opacity-70">
            <div className="text-2xl font-bold text-gray-700">Uber Freight</div>
            <div className="text-2xl font-bold text-blue-600">deel.</div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">KM</div>
            <div className="text-2xl font-bold text-gray-700">CLIPBOARD HEALTH</div>
            <div className="text-2xl font-bold text-red-500 italic">Redis</div>
            <div className="text-2xl font-bold text-gray-700">Stripe</div>
            <div className="text-2xl font-bold text-green-600">Shopify</div>
            <div className="text-2xl font-bold text-purple-600">Notion</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
