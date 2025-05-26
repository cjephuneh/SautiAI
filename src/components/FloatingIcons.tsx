
import { MessageSquare, Phone, TrendingUp } from "lucide-react";

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <MessageSquare 
        className="absolute top-20 left-10 text-blue-300 w-8 h-8 animate-bounce" 
        style={{ animationDelay: '0s', animationDuration: '3s' }}
      />
      <Phone 
        className="absolute top-1/3 right-20 text-purple-300 w-6 h-6 animate-bounce" 
        style={{ animationDelay: '1s', animationDuration: '4s' }}
      />
      <TrendingUp 
        className="absolute bottom-1/3 left-20 text-indigo-300 w-7 h-7 animate-bounce" 
        style={{ animationDelay: '2s', animationDuration: '3.5s' }}
      />
      <div 
        className="absolute top-1/2 right-10 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div 
        className="absolute bottom-20 right-1/3 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
        style={{ animationDelay: '1.5s' }}
      ></div>
    </div>
  );
};

export default FloatingIcons;
