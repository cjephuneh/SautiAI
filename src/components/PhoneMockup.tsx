import { Phone } from "lucide-react";

interface PhoneMockupProps {
  isLoading: boolean;
}

const PhoneMockup = ({ isLoading }: PhoneMockupProps) => {
  return (
    <div className="relative">
      <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl hover:scale-105 transition-transform duration-300">
        <div className="bg-white rounded-[2rem] w-80 h-[600px] relative overflow-hidden">
          {/* Status bar */}
          <div className="flex justify-between items-center p-4 text-xs text-gray-800">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
            </div>
          </div>

          {/* Screen content */}
          <div className="px-6 py-4 h-full flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">DebAI Assistant</h3>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl">
                🤖
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-pulse mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-blue-600 animate-bounce" />
                  </div>
                </div>
                <p className="text-blue-600 font-medium animate-pulse">Initiating call...</p>
                <div className="flex gap-1 mt-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">AI</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Hi! I'm DebAI. I help businesses collect outstanding debts professionally and efficiently. Ready to see how I work?
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <button className="w-full bg-blue-50 hover:bg-blue-100 transition-colors p-3 rounded-lg text-left">
                    <span className="text-sm font-medium text-blue-700">📞 Start Voice Call</span>
                  </button>
                  <button className="w-full bg-green-50 hover:bg-green-100 transition-colors p-3 rounded-lg text-left">
                    <span className="text-sm font-medium text-green-700">💬 Send WhatsApp</span>
                  </button>
                  <button className="w-full bg-purple-50 hover:bg-purple-100 transition-colors p-3 rounded-lg text-left">
                    <span className="text-sm font-medium text-purple-700">📧 Send Email</span>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white text-center">
                  <p className="text-sm font-medium">Ready to collect $2,847</p>
                  <p className="text-xs opacity-90">from 12 outstanding debts</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
