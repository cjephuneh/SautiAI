
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Sparkles, Brain, Zap } from "lucide-react";

interface PhoneMockupProps {
  isLoading: boolean;
  phoneNumber: string;
  email: string;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PhoneMockup = ({ 
  isLoading, 
  phoneNumber, 
  email, 
  onPhoneChange, 
  onEmailChange, 
  onSubmit 
}: PhoneMockupProps) => {
  return (
    <div className="relative">
      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 animate-bounce">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="absolute -top-4 -right-4 animate-pulse">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 animate-bounce animation-delay-1000">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Phone Container */}
      <div className="relative max-w-sm mx-auto transform hover:scale-105 transition-transform duration-500">
        {/* Phone Outer Frame */}
        <div className="bg-gradient-to-br from-gray-800 to-black rounded-[3rem] p-3 shadow-2xl">
          {/* Phone Inner Frame */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-1">
            {/* Screen */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.2rem] w-80 h-[640px] relative overflow-hidden">
              
              {/* Dynamic Island */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <div className="text-xs text-white font-medium">AI Active</div>
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 pt-16 pb-2 text-xs text-white/90">
                <span className="font-medium">9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                  <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
                  <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 h-full flex flex-col items-center justify-center text-center relative">
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse animation-delay-2000"></div>
                </div>

                {/* AI Avatar with Animation */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden">
                    {/* Scanning Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    
                    {/* AI Icon */}
                    <div className="relative z-10 text-2xl font-bold text-white">AI</div>
                    
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                  </div>
                  
                  {/* Floating Icons */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                    <Phone className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Main Text */}
                <h3 className="text-white text-2xl font-bold mb-2 tracking-tight">
                  Get AI Callback
                </h3>
                <p className="text-white/90 text-sm mb-8 leading-relaxed">
                  See how AI recovers your debts<br/>
                  <span className="text-cyan-200 font-medium">in minutes, not months</span>
                </p>

                {/* Form */}
                <form onSubmit={onSubmit} className="w-full space-y-4">
                  {/* Phone Input */}
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">🇺🇸</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => onPhoneChange(e.target.value)}
                      className="bg-white/95 backdrop-blur-sm border-0 h-12 pl-16 text-gray-900 placeholder:text-gray-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <Input
                      type="email"
                      placeholder="Enter your work email"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      className="bg-white/95 backdrop-blur-sm border-0 h-12 text-gray-900 placeholder:text-gray-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 border-0 h-12 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        AI is calling...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        GET AI CALL NOW
                      </div>
                    )}
                  </Button>
                </form>

                {/* Security Note */}
                {!isLoading && (
                  <div className="mt-6 bg-white/10 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full border border-white/20">
                    🔒 Enterprise-grade security & privacy
                  </div>
                )}

                {/* Live Demo Indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live Demo Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[3rem] blur-xl -z-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;
