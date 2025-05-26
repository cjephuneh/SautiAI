
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <section id="hero-form" className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-cyan-200 px-4 py-2 rounded-full text-sm font-medium border border-white/20">
              🤖 AI-Powered Debt Collection
            </div>

            {/* Main Headlines */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Let AI Collect Your Debts —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                The Smart Way 💰🤖
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              DebAI reaches out to your debtors so you don't have to.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-indigo-900 px-8 py-4 text-lg backdrop-blur-sm bg-white/10"
              >
                Watch Demo Video
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-1">50%</div>
                <div className="text-sm text-indigo-200">Higher Collection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-1">20 Days</div>
                <div className="text-sm text-indigo-200">Avg. Collection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-300 mb-1">99%</div>
                <div className="text-sm text-indigo-200">Satisfaction</div>
              </div>
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
        <div className="mt-16 text-center">
          <p className="text-sm text-indigo-300 mb-6">Trusted by 500+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap opacity-60">
            <div className="text-lg font-semibold text-white">Uber Freight</div>
            <div className="text-lg font-semibold text-cyan-300">deel.</div>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">KM</div>
            <div className="text-lg font-semibold text-white">CLIPBOARD HEALTH</div>
            <div className="text-lg font-semibold text-pink-400 italic">Redis</div>
            <div className="text-lg font-semibold text-white">Stripe</div>
            <div className="text-lg font-semibold text-cyan-400">Shopify</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
