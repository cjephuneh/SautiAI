
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
      <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] w-80 h-[640px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-8 py-4 text-sm text-gray-900">
            <span className="font-semibold">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-gray-900 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-8 py-8 h-full flex flex-col items-center justify-center text-center">
            {/* App Icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">AI</span>
            </div>

            {/* Title */}
            <h3 className="text-gray-900 text-2xl font-bold mb-3">
              Get a callback from 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                DebtAI
              </span>
            </h3>
            <p className="text-gray-500 text-base mb-10 leading-relaxed">
              See how AI can recover your debts automatically in just 15 days
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-5">
              {/* Phone Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-xl">🇺🇸</span>
                </div>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="border-gray-200 h-14 pl-16 text-gray-900 placeholder:text-gray-400 rounded-xl text-base"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="border-gray-200 h-14 text-gray-900 placeholder:text-gray-400 rounded-xl text-base"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 font-semibold rounded-xl mt-8 text-base shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Calling...
                  </div>
                ) : (
                  "GET A CALL NOW"
                )}
              </Button>
            </form>

            {/* Security Note */}
            {!isLoading && (
              <div className="mt-8 text-gray-400 text-sm flex items-center gap-2">
                🔒 Your information is secure and encrypted
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
};

export default PhoneMockup;
