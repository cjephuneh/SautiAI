
import { Phone, MessageSquare, TrendingUp, Link, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Phone,
      title: "AI Voice Calls",
      description: "Natural conversations with customers using advanced voice AI that adapts language, tone and approach.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp & SMS",
      description: "Deliver a better customer experience through automated messages, reminders and payment links sent via WhatsApp & SMS.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Dashboard & Reports",
      description: "Real-time analytics on key metrics like call volumes, resolution times, and collections, with customizable reports to track performance and make data-driven decisions.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Link,
      title: "Integrations",
      description: "Seamlessly integrate with your existing CRM, ERP, and enterprise systems.",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Users,
      title: "Human Escalation",
      description: "Complex cases are automatically escalated to your team with full context and history.",
      gradient: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Powerful Features for Modern Call Centre
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DebAI combines cutting-edge AI technology with proven collection strategies to maximize recovery rates while maintaining professional relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to automate conversations at scale? 🚀
            </h3>
            <p className="text-gray-600 mb-6">
              Join over 5+ businesses already using SautiAi to automate their collection process and increase recovery rates.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
