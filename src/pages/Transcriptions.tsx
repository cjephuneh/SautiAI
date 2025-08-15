import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Transcriptions = () => {
  useEffect(() => {
    // Send page view to Google Tag Manager
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GTM-W4PM23HN', {
        page_title: 'Transcriptions - SautiAI',
        page_location: window.location.href,
      });
    }
    
    // Send custom event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Transcriptions - SautiAI',
        page_location: window.location.href,
        page_type: 'feature'
      });
    }
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Call Transcriptions - SautiAI",
    "description": "Automatic call transcription and analysis for Call Centre calls with compliance monitoring and sentiment analysis.",
    "url": "https://sautiai.com/transcriptions"
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Transcription",
      description: "Get instant, accurate transcriptions of all Call Centre calls with 99.5% accuracy."
    },
    {
      icon: <Search className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Analysis",
      description: "Automatic sentiment analysis, compliance checking, and key insight extraction."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Compliance Monitoring",
      description: "Ensure FDCPA compliance with automatic flagging of potential violations."
    },
    {
      icon: <Download className="w-8 h-8 text-orange-600" />,
      title: "Export & Share",
      description: "Download transcripts in multiple formats or share securely with team members."
    }
  ];

  return (
    <>
      <SEOHead
        title="AI Call Transcriptions - SautiAI Call Centre Platform"
        description="Automatic call transcription and analysis for Call Centre calls. Real-time transcription with compliance monitoring and sentiment analysis."
        keywords="call transcription, Call Centre transcripts, AI transcription, compliance monitoring, call analysis"
        url="https://sautiai.com/transcriptions"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
        <Navbar />
        
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                📝 AI-Powered Transcriptions
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Never Miss a Word with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  AI Transcriptions
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get real-time, accurate transcriptions of all your Call Centre calls with automatic compliance monitoring and sentiment analysis.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Demo Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">See Transcriptions in Action</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Real-time processing as calls happen</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Automatic compliance checking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Searchable conversation history</span>
                    </div>
                  </div>
                  <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Start Free Trial
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Live Transcription</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <span className="font-medium text-blue-600">Agent:</span>
                        <span className="text-gray-700">Good morning, this is Sarah calling from ABC Collections regarding your account ending in 1234.</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-purple-600">Customer:</span>
                        <span className="text-gray-700">Hi Sarah, I've been meaning to call about setting up a payment plan.</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-blue-600">Agent:</span>
                        <span className="text-gray-700">I'd be happy to help you with that. Let me review your account options...</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>🟢 Compliance: Approved</span>
                        <span>😊 Sentiment: Positive</span>
                        <span>⏱️ Duration: 2:34</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose SautiAI Transcriptions?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-4">99.5%</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Accuracy</h3>
                  <p className="text-gray-600">Industry-leading transcription accuracy powered by advanced AI</p>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-4">&lt;2s</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time</h3>
                  <p className="text-gray-600">Get transcriptions in near real-time as conversations happen</p>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-green-600 mb-4">100%</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliant</h3>
                  <p className="text-gray-600">Automatic compliance monitoring and violation detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Transcriptions;
