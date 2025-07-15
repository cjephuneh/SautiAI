import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    // Send page view to Google Tag Manager
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GTM-W4PM23HN', {
        page_title: 'Pricing - SautiAI',
        page_location: window.location.href,
      });
    }
    
    // Send custom event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Pricing - SautiAI',
        page_location: window.location.href,
        page_type: 'pricing'
      });
    }
  }, []);

  const handlePlanSelect = (planName: string, price: number) => {
    // Send plan selection event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'plan_selected',
        plan_name: planName,
        plan_price: price,
        billing_cycle: billingCycle,
        page_location: window.location.href
      });
    }

    toast({
      title: "Plan Selected! 🎉",
      description: `You selected the ${planName} plan. Redirecting to checkout...`,
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "SautiAI Debt Collection Plans",
    "description": "AI-powered debt collection pricing plans for businesses of all sizes",
    "provider": {
      "@type": "Organization",
      "name": "SautiAI"
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started",
      price: { monthly: 49, annual: 490 },
      features: [
        "Up to 100 contacts",
        "5 AI calling hours/month",
        "Basic analytics",
        "Email support",
        "Standard compliance tools"
      ],
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing collection agencies",
      price: { monthly: 149, annual: 1490 },
      features: [
        "Up to 1,000 contacts",
        "25 AI calling hours/month",
        "Advanced analytics",
        "Priority support",
        "Full compliance suite",
        "Custom AI agents",
        "Bulk operations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex needs",
      price: { monthly: 399, annual: 3990 },
      features: [
        "Unlimited contacts",
        "100 AI calling hours/month",
        "White-label solution",
        "Dedicated support",
        "Advanced compliance",
        "API access",
        "Custom integrations",
        "Training & onboarding"
      ],
      popular: false
    }
  ];

  return (
    <>
      <SEOHead
        title="Pricing Plans - SautiAI AI Debt Collection Platform"
        description="Choose the perfect SautiAI plan for your debt collection needs. Flexible pricing for businesses of all sizes with 65% higher recovery rates."
        keywords="debt collection pricing, AI collection plans, SautiAI pricing, debt recovery software cost"
        url="https://sautiai.com/pricing"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
        <Navbar />
        
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                💰 Simple, Transparent Pricing
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Choose Your 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Perfect Plan
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Start recovering 65% more outstanding payments today. No setup fees, cancel anytime.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annual
                </span>
                {billingCycle === 'annual' && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Save 17%
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 p-8 ${
                    plan.popular 
                      ? 'border-blue-500 scale-105' 
                      : 'border-gray-100'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-500">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>

                    <Button
                      onClick={() => handlePlanSelect(plan.name, plan.price[billingCycle])}
                      className={`w-full py-3 rounded-lg font-semibold text-base ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      Get Started
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                  <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
                  <p className="text-gray-600">No setup fees or hidden costs. You only pay for your selected plan.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
                  <p className="text-gray-600">We'll notify you when approaching limits and offer easy upgrade options.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all plans.</p>
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

export default Pricing;
