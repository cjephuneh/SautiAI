import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    { name: "Call Transcriptions", href: "/transcriptions" },
    { name: "Dashboard & Reports", href: "/dashboard" }
  ];

  const resources = [
    { name: "Case Studies", href: "#testimonials" },
    { name: "Integrations", href: "/integrations" },
    { name: "API Reference", href: "/integrations#api" },
    { name: "Support Center", href: "#" },
    { name: "Blogs", href: "/blogs" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Solutions <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100/50 py-2 z-50 backdrop-blur-lg">
                  {solutions.map((item) => (
                    item.href.startsWith('#') ? (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              How it Works
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Features
            </a>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                  Resources
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {resources.map((item) => (
                  <DropdownMenuItem asChild key={item.name}>
                    {item.href.startsWith('#') || item.href.startsWith('/integrations#') ? (
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
                Sign In
              </Button>
            </Link>
            <Link to="/book-call">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all text-sm">
                Book a Call
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900 px-4">Solutions</p>
                {solutions.map((item) => (
                  item.href.startsWith('#') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
              
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                How it Works
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Features
              </a>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Pricing
              </Link>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2">
                Testimonials
              </a>

              <div className="space-y-2 pt-4">
                <p className="text-sm font-semibold text-gray-900 px-4">Resources</p>
                {resources.map((item) => (
                  item.href.startsWith('#') || item.href.startsWith('/integrations#') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-6 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-6 px-4">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-blue-600 justify-start w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/book-call">
                  <Button 
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-start w-full"
                  >
                    Book a Call
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
