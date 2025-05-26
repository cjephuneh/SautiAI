
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Integrations = () => {
  const integrations = [
    {
      category: "CRM Systems",
      items: [
        { name: "Salesforce", logo: "💼", description: "Sync customer data and payment status" },
        { name: "HubSpot", logo: "🧡", description: "Automate debt collection workflows" },
        { name: "Pipedrive", logo: "🔷", description: "Track collection progress in your pipeline" },
        { name: "Zoho CRM", logo: "🟠", description: "Seamless customer data integration" }
      ]
    },
    {
      category: "Accounting Software",
      items: [
        { name: "QuickBooks", logo: "💚", description: "Sync invoices and payment records" },
        { name: "Xero", logo: "🔵", description: "Automated reconciliation and reporting" },
        { name: "FreshBooks", logo: "🟢", description: "Invoice tracking and collection" },
        { name: "Sage", logo: "🟤", description: "Enterprise accounting integration" }
      ]
    },
    {
      category: "Communication Platforms",
      items: [
        { name: "WhatsApp Business", logo: "💬", description: "Reach customers on their preferred channel" },
        { name: "Twilio", logo: "📱", description: "SMS and voice call infrastructure" },
        { name: "SendGrid", logo: "📧", description: "Professional email delivery" },
        { name: "Mailgun", logo: "✉️", description: "Reliable email API integration" }
      ]
    },
    {
      category: "Analytics & Reporting",
      items: [
        { name: "Google Analytics", logo: "📊", description: "Track collection performance metrics" },
        { name: "Tableau", logo: "📈", description: "Advanced data visualization" },
        { name: "Power BI", logo: "📋", description: "Microsoft business intelligence" },
        { name: "Looker", logo: "👁️", description: "Custom dashboards and reports" }
      ]
    },
    {
      category: "Payment Processing",
      items: [
        { name: "Stripe", logo: "💳", description: "Accept online payments instantly" },
        { name: "PayPal", logo: "🅿️", description: "Global payment processing" },
        { name: "Square", logo: "⬜", description: "In-person and online payments" },
        { name: "Authorize.Net", logo: "🔐", description: "Secure payment gateway" }
      ]
    },
    {
      category: "Business Tools",
      items: [
        { name: "Slack", logo: "💬", description: "Team notifications and updates" },
        { name: "Microsoft Teams", logo: "👥", description: "Collaborative debt management" },
        { name: "Zapier", logo: "⚡", description: "Connect 3000+ apps with automation" },
        { name: "Make (Integromat)", logo: "🔗", description: "Advanced workflow automation" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Integrations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect DebtAI with your existing tools and workflows. 
            No disruption to your current processes.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
            View All Integrations
          </Button>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {integrations.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((integration, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{integration.logo}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {integration.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm text-center mb-4">
                      {integration.description}
                    </p>
                    <Button variant="outline" className="w-full">
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Custom Integration Needed?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Use our powerful REST API to build custom integrations with any system.
          </p>
          <div className="bg-gray-900 rounded-xl p-6 text-left mb-8">
            <pre className="text-green-400 text-sm overflow-x-auto">
{`curl -X POST https://api.debtai.com/v1/debts \\
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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              View API Docs
            </Button>
            <Button variant="outline">
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
