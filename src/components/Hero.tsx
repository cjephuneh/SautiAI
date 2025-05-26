
import { useState } from "react";
import { Phone, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PhoneMockup from "./PhoneMockup";
import FloatingIcons from "./FloatingIcons";

const Hero = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
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

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success! 🎉",
        description: "DebAI will call you within 2 minutes",
      });
      setPhoneNumber("");
    }, 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <FloatingIcons />
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Let AI Collect Your Debts — The Smart Way 💰🤖
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            DebAI reaches out to your debtors so you don't have to. Automated calls, messages, and follow-ups powered by intelligent AI.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Calling...
                </div>
              ) : (
                "Get a Callback from DebAI 📞"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>24/7 Automated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
