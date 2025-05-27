
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "20%",
      description: "Perfect for small businesses",
      features: [
        "Up to 100 debts per month",
        "Email & SMS outreach",
        "Basic analytics dashboard",
        "Standard support (24h response)",
        "CRM integration",
        "Payment tracking"
      ],
      notIncluded: [
        "Voice AI calls",
        "WhatsApp messaging",
        "Advanced analytics",
        "Priority support"
      ],
      popular: false,
      color: "blue"
    },
    {
      name: "Professional", 
      price: "15%",
      description: "Most popular for growing businesses",
      features: [
        "Up to 500 debts per month",
        "All communication channels",
        "Voice AI calls included",
        "WhatsApp messaging",
        "Advanced analytics & reporting",
        "Priority support (4h response)",
        "Custom integrations",
        "Real-time dashboards",
        "A/B testing"
      ],
      notIncluded: [
        "White-label solution",
        "Dedicated account manager"
      ],
      popular: true,
      color: "purple"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited debts",
        "All Professional features",
        "White-label solution", 
        "Dedicated account manager",
        "Custom AI training",
        "SLA guarantees (99.9% uptime)",
        "On-premise deployment options",
        "24/7 phone support",
        "Custom compliance rules"
      ],
      notIncluded: [],
      popular: false,
      color: "indigo"
    }
  ];

  const faqs = [
    {
      question: "How does the percentage-based pricing work?",
      answer: "You only pay when we successfully collect a debt. Our fee is a percentage of the amount collected, so you never pay upfront costs or monthly subscriptions."
    },
    {
      question: "What happens if DebtAI doesn't collect the debt?",
      answer: "If we don't collect, you don't pay. It's that simple. We're incentivized to recover your debts successfully, aligning our success with yours."
    },
    {
      question: "How quickly can I get started?",
      answer: "Setup takes less than 10 minutes. Simply upload your debtor list, configure your preferences, and DebtAI will start working immediately."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
    },
    {
      question: "Is there a minimum contract period?",
      answer: "No long-term contracts required. You can cancel anytime with 30 days notice. We believe in earning your business every month."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            💰 Only Pay When We Collect
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            No upfront costs. No hidden fees. Only pay when we successfully recover your debts.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                plan.popular 
                  ? 'border-purple-500 relative scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${
                      plan.color === 'purple' ? 'from-purple-600 to-blue-600' :
                      plan.color === 'indigo' ? 'from-indigo-600 to-purple-600' :
                      'from-blue-600 to-indigo-600'
                    } bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-sm text-gray-500 ml-1">of collected amount</span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full py-3 font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
                      : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 bg-white'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
