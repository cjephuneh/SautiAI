
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
    <section className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Headlines */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Respectful B2B collection
          </h1>
          <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            powered by AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Collect 50% of your account receivables in 20 days.
          </p>
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

        {/* Company Logos */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap opacity-60">
            <div className="text-lg font-semibold text-gray-700">Uber Freight</div>
            <div className="text-lg font-semibold text-blue-600">deel.</div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">KM</div>
            <div className="text-lg font-semibold text-gray-700">CLIPBOARD HEALTH</div>
            <div className="text-lg font-semibold text-red-500 italic">Redis</div>
            <div className="text-lg font-semibold text-gray-700">Uber Freight</div>
            <div className="text-lg font-semibold text-blue-600">deel.</div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">KM</div>
            <div className="text-lg font-semibold text-gray-700">CLIPBOARD HEALTH</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
