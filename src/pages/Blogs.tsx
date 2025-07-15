import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Blogs = () => {
  useEffect(() => {
    // Send page view to Google Tag Manager
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GTM-W4PM23HN', {
        page_title: 'Blogs - SautiAI',
        page_location: window.location.href,
      });
    }
    
    // Send custom event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Blogs - SautiAI',
        page_location: window.location.href,
        page_type: 'blogs'
      });
    }
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SautiAI Blog",
    "description": "Explore insights, tips, and strategies for AI-powered debt collection and business growth.",
    "url": "https://sautiai.com/blogs"
  };

  const blogPosts = [
    {
      title: "How AI is Revolutionizing Debt Collection",
      description: "Discover how artificial intelligence is transforming the debt collection industry with automation and smart strategies.",
      date: "2024-01-15",
      author: "SautiAI Team",
      url: "/blogs/ai-debt-collection"
    },
    {
      title: "Top 5 Strategies to Improve Recovery Rates",
      description: "Learn the best practices for increasing recovery rates and optimizing your debt collection process.",
      date: "2024-01-10",
      author: "SautiAI Experts",
      url: "/blogs/improve-recovery-rates"
    },
    {
      title: "Compliance in Debt Collection: What You Need to Know",
      description: "Understand the importance of compliance in debt collection and how SautiAI ensures regulatory adherence.",
      date: "2024-01-05",
      author: "SautiAI Legal Team",
      url: "/blogs/debt-collection-compliance"
    }
  ];

  return (
    <>
      <SEOHead
        title="Blogs - SautiAI | Insights on AI Debt Collection"
        description="Explore insights, tips, and strategies for AI-powered debt collection and business growth. Stay updated with the latest trends and innovations."
        keywords="AI debt collection blogs, debt recovery tips, compliance strategies, business growth, SautiAI insights"
        url="https://sautiai.com/blogs"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
        <Navbar />
        
        <div className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                📝 Latest Insights
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Explore Our 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Blog Posts
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Stay updated with the latest trends, tips, and strategies for AI-powered debt collection and business growth.
              </p>
            </div>

            {/* Blog Posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <a 
                  key={index} 
                  href={post.url} 
                  className="block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="text-sm text-gray-500">
                    <span>{post.date}</span> | <span>{post.author}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blogs;
