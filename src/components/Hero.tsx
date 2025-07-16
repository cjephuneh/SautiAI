
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PhoneMockup from "./PhoneMockup";
import CommunicationTimeline from "./CommunicationTimeline";

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
        description: "SautiAI will call you within 2 minutes",
      });
      setPhoneNumber("");
      setEmail("");
    }, 2000);
  };

  return (
    <section id="hero-form" className="py-12 px-4 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
              🤖 AI-Powered Call Center & Customer Engagement
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              We listen, speak and deliver  -
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                   the African way.
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
              Voice AI that speaks your customer’s language, across debt, Customer Experience & outbound campaigns.
              </p>
            </div>

            

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 mb-1">50%</div>
                <div className="text-xs text-gray-600">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 mb-1">80%</div>
                <div className="text-xs text-gray-600">Inbound Automation</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 mb-1">40%</div>
                <div className="text-xs text-gray-600">Better Contact Rates</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-600 mb-1">24/7</div>
                <div className="text-xs text-gray-600">Automated</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button 
                onClick={() => window.location.href = "/book-call"}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 text-base font-semibold rounded-lg"
                onClick={() => window.location.href = "/book-call"}
              >
                Book a Demo
              </Button>
            </div>
          </div>

          {/* Right - Phone Mockup */}
          <div className="flex justify-center lg:justify-end mt-16">
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
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-6 text-sm">Trusted by 5+ businesses worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
            <div className="text-base font-bold text-gray-700">BricklabsAI</div>
            <div className="text-base font-bold text-blue-600">Therabot</div>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">KM</div>
            {/* <div className="text-base font-bold text-gray-700">CLIPBOARD HEALTH</div> */}
            <div className="text-base font-bold text-red-500 italic">Farmsawa</div>
            {/* <div className="text-base font-bold text-gray-700">Stripe</div> */}
          </div>
        </div>
         {/* Communication Timeline Section */}
         <div className="mt-12">
          <CommunicationTimeline />
        </div> 
      </div>
    </section>
  );
};

export default Hero;
