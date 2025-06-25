
import { Upload, Brain, TrendingUp, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Data",
      description: "Simply upload your debtor list via CSV, Excel, or connect your existing CRM system like Salesforce, HubSpot, or Pipedrive.",
      emoji: "📤",
      details: ["CSV/Excel import", "CRM integrations", "API connections", "Bulk data processing"]
    },
    {
      icon: Brain,
      title: "AI Analyzes & Strategizes",
      description: "Our advanced AI analyzes each case, creates personalized outreach strategies, and determines the optimal communication approach.",
      emoji: "🧠",
      details: ["Debtor profiling", "Risk assessment", "Strategy optimization", "Communication timing"]
    },
    {
      icon: Zap,
      title: "Automated Outreach",
      description: "SautiAII reaches out via voice calls, WhatsApp, SMS, and email with human-like conversations tailored to each debtor.",
      emoji: "⚡",
      details: ["Voice AI calls", "WhatsApp messaging", "Email sequences", "SMS reminders"]
    },
    {
      icon: TrendingUp,
      title: "Track & Collect",
      description: "Monitor real-time progress, track payments, and watch your collection rates soar with detailed analytics and reporting.",
      emoji: "📈",
      details: ["Real-time dashboard", "Payment tracking", "Success analytics", "Custom reports"]
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            🚀 Simple 4-Step Process
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            How SautiAII Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your debt collection process in minutes. Our AI handles everything from initial contact to payment collection with unprecedented efficiency.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 h-full">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <span className="text-4xl">{step.emoji}</span>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-base">
                    {step.description}
                  </p>

                  {/* Feature details */}
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-purple-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to automate your debt collection? 🚀
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join 1,200+ businesses using SautiAII to recover more debts faster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
