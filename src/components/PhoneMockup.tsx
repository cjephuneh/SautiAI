
import { Phone } from "lucide-react";
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
    <div className="relative max-w-sm mx-auto">
      <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-[2rem] w-80 h-[600px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center p-4 text-xs text-white/90">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-8 py-6 h-full flex flex-col items-center justify-center text-center">
            {/* AI Logo */}
            <div className="w-20 h-20 bg-white rounded-full mb-8 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                AI
              </div>
            </div>

            {/* Main Text */}
            <h3 className="text-white text-xl font-semibold mb-8">
              Let AI collect $1 from you
            </h3>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-4">
              {/* Phone Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">🇺🇸</span>
                </div>
                <Input
                  type="tel"
                  placeholder="+254709837373"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="bg-white/95 border-0 h-12 pl-16 text-gray-900 placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="bg-white/95 border-0 h-12 text-gray-900 placeholder:text-gray-500"
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 border-0 h-12 text-white font-medium rounded-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Calling...
                  </div>
                ) : (
                  "GET A CALL"
                )}
              </Button>
            </form>

            {/* Validation Message */}
            {!isLoading && (
              <div className="mt-4 bg-red-500 text-white text-xs px-3 py-2 rounded-full">
                Enter a valid US phone number and your work email
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
