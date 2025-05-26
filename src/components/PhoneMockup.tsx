
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
    <div className="relative">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-white rounded-[2rem] w-80 h-[600px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 text-sm text-gray-900">
            <span className="font-medium">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-gray-900 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-8 py-6 h-full flex flex-col items-center justify-center text-center">
            {/* App Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-8 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>

            {/* Title */}
            <h3 className="text-gray-900 text-xl font-bold mb-2">
              Get a callback from DebAI
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              See how AI can recover your debts automatically
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-4">
              {/* Phone Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                </div>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="border-gray-200 h-12 pl-16 text-gray-900 placeholder:text-gray-400 rounded-lg"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="border-gray-200 h-12 text-gray-900 placeholder:text-gray-400 rounded-lg"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12 font-semibold rounded-lg mt-6"
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
              <div className="mt-6 text-gray-400 text-xs flex items-center gap-1">
                🔒 Your information is secure and encrypted
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
