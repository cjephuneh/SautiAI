import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    // Clear session data when on login page to prevent conflicts
    localStorage.removeItem('sautiai_session');
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  useEffect(() => {
    // Only redirect if user is on the login page and authenticated
    // Don't redirect if they're already on a dashboard page
    if (isAuthenticated && !isLoading && !hasRedirectedRef.current && isMountedRef.current) {
      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath === '/login';
      const isOnDashboardPage = currentPath.startsWith('/dashboard');
      
      if (isOnLoginPage && !isOnDashboardPage) {
        hasRedirectedRef.current = true;
        console.log('Login: Redirecting to dashboard because already authenticated');
      navigate('/dashboard', { replace: true });
      } else {
        console.log('Login: User authenticated but not on login page, skipping redirect. Current path:', currentPath);
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      if (!isMountedRef.current) return;
      
      // Clear any stale session data from before login
      localStorage.removeItem('sautiai_session');
      
      toast({
        title: "Login Successful! 🎉",
        description: "Welcome back! Redirecting to dashboard...",
      });
      
      // Mark that we're about to redirect
      hasRedirectedRef.current = true;
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
      
    } catch (error: any) {
      console.error("Failed to login:", error);
      if (!isMountedRef.current) return;
      
      toast({
        title: "Login Failed",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="xl" showText={false} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SautiAI
            </h1>
            <p className="text-gray-500 text-sm">Smart Call Centre Platform</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="test@example.com"
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Sign In Securely
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </form>

            {/* Enhanced Demo Credentials */}
            {/* <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Quick Demo Access</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-700">📧 Email: test@example.com</p>
                <p className="text-xs text-blue-700">🔑 Password: secret123</p>
              </div>
              <p className="text-xs text-blue-600 mt-2 italic">Use these credentials for instant access</p>
            </div> */}

            {/* Security Features */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `
      }} />
    </div>
  );
};

export default Login;
