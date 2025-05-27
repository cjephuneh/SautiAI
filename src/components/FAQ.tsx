
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does DebtAI collect debts differently than traditional methods?",
      answer: "DebtAI uses advanced AI to have natural, human-like conversations with debtors via voice calls, WhatsApp, and SMS. Our AI understands context, shows empathy, and negotiates payment plans automatically - recovering 65% more debts than traditional methods."
    },
    {
      question: "What happens if the AI can't resolve a debt?",
      answer: "If our AI reaches an impasse, the case is automatically escalated to your human team with full conversation history and suggested next steps. You maintain full control while the AI handles the majority of routine collections."
    },
    {
      question: "How quickly can I see results?",
      answer: "Most clients see their first successful collections within 24-48 hours of setup. Our AI works 24/7, so it's constantly engaging with debtors across different time zones and schedules."
    },
    {
      question: "Is DebtAI compliant with debt collection regulations?",
      answer: "Absolutely. DebtAI is fully compliant with FDCPA, TCPA, and other relevant regulations. Our AI is trained on current compliance requirements and automatically follows all legal guidelines for debt collection communications."
    },
    {
      question: "Can I customize how the AI communicates with my debtors?",
      answer: "Yes! You can customize the AI's tone, communication style, payment options, and escalation triggers. The AI learns from your preferences and successful collection strategies to improve over time."
    },
    {
      question: "What integrations are available?",
      answer: "DebtAI integrates with popular CRMs (Salesforce, HubSpot), accounting software (QuickBooks, Xero), and payment processors (Stripe, PayPal). We also offer a robust API for custom integrations."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about DebtAI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenItem(openItem === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openItem === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openItem === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
