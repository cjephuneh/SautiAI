
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="relative max-w-md mx-auto">
      <div className="bg-black rounded-[3rem] p-3 shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-[2.5rem] w-96 h-[700px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-4 text-sm text-white/90">
            <span className="font-medium">9:41</span>
            <div className="flex gap-1">
              <div className="w-5 h-3 bg-white/80 rounded-sm"></div>
              <div className="w-5 h-3 bg-white/60 rounded-sm"></div>
              <div className="w-5 h-3 bg-white/40 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-10 py-8 h-full flex flex-col items-center justify-center text-center">
            {/* AI Logo */}
            <div className="w-24 h-24 bg-white rounded-full mb-10 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                AI
              </div>
            </div>

            {/* Main Text */}
            <h3 className="text-white text-2xl font-bold mb-3">
              Get a callback from DebAI
            </h3>
            <p className="text-white/80 text-base mb-12 leading-relaxed">
              See how AI can recover your debts automatically
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-6">
              {/* Phone Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3 text-base text-gray-600">
                  <span className="text-xl">🇺🇸</span>
                </div>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="bg-white/95 border-0 h-14 pl-20 text-gray-900 placeholder:text-gray-500 rounded-xl text-base shadow-lg"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="bg-white/95 border-0 h-14 text-gray-900 placeholder:text-gray-500 rounded-xl text-base shadow-lg"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 border-0 h-14 font-semibold rounded-xl shadow-2xl text-base mt-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                    Calling...
                  </div>
                ) : (
                  "GET A CALL NOW"
                )}
              </Button>
            </form>

            {/* Security Note */}
            {!isLoading && (
              <div className="mt-8 bg-white/15 text-white text-sm px-4 py-3 rounded-full backdrop-blur-sm border border-white/20">
                🔒 Your information is secure and encrypted
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce shadow-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-green-400 rounded-full animate-pulse shadow-xl"></div>
      <div className="absolute top-1/4 -right-4 w-8 h-8 bg-pink-400 rounded-full animate-ping shadow-xl"></div>
    </div>
  );
};

export default PhoneMockup;
