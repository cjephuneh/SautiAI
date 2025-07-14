
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Integrations = () => {
  const integrations = [
    {
      category: "CRM Systems",
      items: [
        { 
          name: "Salesforce", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
          description: "Sync customer data and payment status automatically",
          color: "bg-blue-500"
        },
        { 
          name: "HubSpot", 
          logo: "🧡", 
          description: "Automate debt collection workflows seamlessly",
          color: "bg-orange-500"
        },
        { 
          name: "Pipedrive", 
          logo: "🔷", 
          description: "Track collection progress in your sales pipeline",
          color: "bg-green-500"
        },
        { 
          name: "Zoho CRM", 
          logo: "🟠", 
          description: "Complete customer data integration",
          color: "bg-red-500"
        }
      ]
    },
    {
      category: "Accounting Software",
      items: [
        { 
          name: "QuickBooks", 
          logo: "💚", 
          description: "Automatic invoice sync and payment reconciliation",
          color: "bg-green-600"
        },
        { 
          name: "Xero", 
          logo: "🔵", 
          description: "Real-time financial data and reporting",
          color: "bg-blue-600"
        },
        { 
          name: "FreshBooks", 
          logo: "🟢", 
          description: "Invoice tracking and collection automation",
          color: "bg-emerald-600"
        },
        { 
          name: "Sage", 
          logo: "🟤", 
          description: "Enterprise-grade accounting integration",
          color: "bg-amber-600"
        }
      ]
    },
    {
      category: "Communication Platforms",
      items: [
        { 
          name: "WhatsApp Business", 
          logo: "💬", 
          description: "Reach customers on their preferred messaging platform",
          color: "bg-green-500"
        },
        { 
          name: "Twilio", 
          logo: "📱", 
          description: "SMS and voice call infrastructure",
          color: "bg-red-500"
        },
        { 
          name: "SendGrid", 
          logo: "📧", 
          description: "Professional email delivery and tracking",
          color: "bg-blue-500"
        },
        { 
          name: "Mailgun", 
          logo: "✉️", 
          description: "Reliable transactional email API",
          color: "bg-orange-500"
        }
      ]
    },
    {
      category: "Payment Processing",
      items: [
        { 
          name: "Stripe", 
          logo: "💳", 
          description: "Accept online payments instantly",
          color: "bg-indigo-500"
        },
        { 
          name: "PayPal", 
          logo: "🅿️", 
          description: "Global payment processing solution",
          color: "bg-blue-500"
        },
        { 
          name: "Square", 
          logo: "⬜", 
          description: "In-person and online payment processing",
          color: "bg-gray-800"
        },
        { 
          name: "Authorize.Net", 
          logo: "🔐", 
          description: "Secure payment gateway integration",
          color: "bg-green-500"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🔗 Seamless Integrations
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Connect with Your Existing Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            SautiAI integrates seamlessly with 100+ popular business tools. 
            No disruption to your current workflows.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg">
            View All Integrations
          </Button>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {integrations.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((integration, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${integration.color}`}>
                        <span className="text-2xl">{integration.logo}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {integration.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">
                      {integration.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-600 transition-all"
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need a Custom Integration?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Use our powerful REST API to build custom integrations with any system.
          </p>
          <div className="bg-gray-900 rounded-xl p-6 text-left mb-8 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`curl -X POST https://api.SautiAI.com/v1/debts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "debtor_email": "john@example.com",
    "amount": 1250.00,
    "due_date": "2024-01-15",
    "description": "Invoice #INV-001"
  }'`}
            </pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
              View API Documentation
            </Button>
            <Button variant="outline" className="px-6 py-3 rounded-lg font-semibold border-2">
              Request Custom Integration
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
