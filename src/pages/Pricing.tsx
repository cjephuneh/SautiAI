
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "20%",
      description: "Perfect for small businesses",
      features: [
        "Up to 100 debts per month",
        "Email & SMS outreach",
        "Basic analytics",
        "Standard support",
        "CRM integration"
      ],
      notIncluded: [
        "Voice AI calls",
        "WhatsApp messaging",
        "Advanced analytics",
        "Priority support"
      ],
      popular: false
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
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Real-time reporting"
      ],
      notIncluded: [
        "White-label solution",
        "Dedicated account manager"
      ],
      popular: true
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
        "SLA guarantees",
        "On-premise deployment",
        "24/7 phone support"
      ],
      notIncluded: [],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the percentage-based pricing work?",
      answer: "You only pay when we successfully collect a debt. Our fee is a percentage of the amount collected, so you never pay upfront costs."
    },
    {
      question: "What happens if DebtAI doesn't collect the debt?",
      answer: "If we don't collect, you don't pay. It's that simple. We're incentivized to recover your debts successfully."
    },
    {
      question: "How quickly can I get started?",
      answer: "Setup takes less than 10 minutes. Simply upload your debtor list and DebtAI will start working immediately."
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer: "Yes! We support integrations with Salesforce, HubSpot, Pipedrive, and many other popular CRM systems."
    },
    {
      question: "Is there a minimum contract period?",
      answer: "No, you can cancel anytime. We believe in earning your business every month, not locking you into long contracts."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Only pay when we successfully collect. No upfront costs, no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${plan.popular ? 'border-blue-500 relative' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-lg text-gray-500"> of collected amount</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <X className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full py-3 ${plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
