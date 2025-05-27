
import { Mail, Phone, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <span className="font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-bold">DebtAI</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Revolutionizing debt collection with AI-powered automation. Professional, efficient, and results-driven collection services for modern businesses.
            </p>
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#features" className="hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="/integrations" className="hover:text-white transition-colors text-sm">Integrations</a></li>
              <li><a href="/transcriptions" className="hover:text-white transition-colors text-sm">AI Transcriptions</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0 text-sm">
              © 2024 DebtAI. All rights reserved. Powered by AI technology.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Status: Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
