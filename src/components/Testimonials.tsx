
const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CFO at TechFlow Solutions",
      company: "TechFlow",
      quote: "DebAI increased our collection rate by 280% in just 3 months. The AI conversations are so natural, our clients actually prefer them to traditional collection calls.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Finance Director",
      company: "GrowthCorp",
      quote: "What used to take our team 40 hours per week now happens automatically. DebAI has transformed our cash flow management completely.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Business Owner",
      company: "Creative Studios",
      quote: "Finally, a solution that maintains our client relationships while efficiently collecting outstanding payments. The ROI has been incredible.",
      avatar: "ET"
    }
  ];

  const logos = [
    "TechFlow", "GrowthCorp", "Creative Studios", "InnovateCo", "ScaleUp"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Trusted by Growing Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how companies are transforming their debt collection with DebAI
          </p>
        </div>

        {/* Company logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
          {logos.map((logo, index) => (
            <div key={index} className="bg-white rounded-lg px-6 py-3 shadow-sm">
              <span className="text-gray-700 font-semibold">{logo}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Average Results</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">280%</p>
                <p className="text-sm text-gray-600">Collection Rate Increase</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">75%</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">95%</p>
                <p className="text-sm text-gray-600">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
