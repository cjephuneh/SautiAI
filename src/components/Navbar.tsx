
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleRequestDemo = () => {
    const heroSection = document.querySelector('#hero-form');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const solutions = [
    { name: "AI Voice Calls", href: "#features" },
    { name: "WhatsApp & SMS", href: "#features" },
    { name: "Dashboard & Reports", href: "#features" },
    { name: "Integrations", href: "#features" }
  ];

  const resources = [
    { name: "Case Studies", href: "#testimonials" },
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Support Center", href: "#" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DebtAI
              </span>
              <span className="text-xs text-gray-500 -mt-1">Smart Collections</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Solutions <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {solutions.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How it Works
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Resources <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {resources.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
              Sign In
            </Button>
            <Button 
              onClick={handleRequestDemo}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900 px-4">Solutions</p>
                {solutions.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                How it Works
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Pricing
              </a>

              <div className="space-y-2 pt-4">
                <p className="text-sm font-semibold text-gray-900 px-4">Resources</p>
                {resources.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-6 px-4">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 justify-start">
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    handleRequestDemo();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-start"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
