import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare, X, Lightbulb, AlertTriangle, ExternalLink } from "lucide-react";
import { HelpModal } from "./help-modal";

interface HelpButtonProps {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export const HelpButton = ({ 
  variant = "outline", 
  size = "sm", 
  className = "",
  showText = true 
}: HelpButtonProps) => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setHelpOpen(true)}
      >
        <HelpCircle className="h-4 w-4" />
        {showText && <span className="ml-2">Help</span>}
      </Button>
      
      <HelpModal 
        open={helpOpen} 
        onOpenChange={setHelpOpen} 
      />
    </>
  );
};

export const FloatingHelpButton = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [fullModalOpen, setFullModalOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    setHelpOpen(false);
    setFullModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 p-0"
          onClick={() => setHelpOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        {/* Chatbot-style modal positioned above the button */}
        <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
          helpOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">SautiAI Support</h3>
                    <p className="text-xs text-blue-100">How can we help?</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                  onClick={() => setHelpOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <div className="text-lg font-semibold text-gray-900 mb-1">Hi there 👋</div>
                    <div className="text-sm text-gray-600">How can we help?</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm h-10"
                      onClick={() => handleQuickAction('messages')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send us a message
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleQuickAction('feature')}
                      >
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Feature
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleQuickAction('bug')}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Bug Report
                      </Button>
                    </div>
                    
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => handleQuickAction('docs')}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        How to create agents
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => handleQuickAction('api')}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Refer API Docs
                      </Button>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full text-xs h-8 text-blue-600 hover:text-blue-700"
                        onClick={() => handleQuickAction('full')}
                      >
                        View all options →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full Help Modal */}
      <HelpModal 
        open={fullModalOpen} 
        onOpenChange={setFullModalOpen} 
      />
    </>
  );
};
