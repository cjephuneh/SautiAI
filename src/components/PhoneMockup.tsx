
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
    <div className="relative transform hover:scale-105 transition-transform duration-300">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
        <div className="bg-white rounded-2xl w-64 h-[500px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 text-xs text-gray-900">
            <span className="font-semibold">9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1.5 bg-gray-900 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-gray-400 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-6 py-4 h-full flex flex-col items-center justify-center text-center">
            {/* App Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl mb-6 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">AI</span>
            </div>

            {/* Title */}
            <h3 className="text-gray-900 text-lg font-bold mb-2">
              Get a callback from 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                SautiAI
              </span>
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              See how AI can recover your debts automatically in just 15 days
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-3">
              {/* Phone Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <span className="text-sm">🇺🇸</span>
                </div>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="border-gray-200 h-10 pl-12 text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="border-gray-200 h-10 text-gray-900 placeholder:text-gray-400 rounded-lg text-sm"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-10 font-semibold rounded-lg mt-4 text-sm shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Calling...
                  </div>
                ) : (
                  "GET A CALL NOW"
                )}
              </Button>
            </form>

            {/* Security Note */}
            {!isLoading && (
              <div className="mt-6 text-gray-400 text-xs flex items-center gap-1 mb-6">
                🔒 Your information is secure
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
};

export default PhoneMockup;
