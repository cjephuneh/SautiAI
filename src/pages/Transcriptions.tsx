
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Filter } from "lucide-react";
import { useState } from "react";

const Transcriptions = () => {
  const [selectedCall, setSelectedCall] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const callTranscripts = [
    {
      id: 1,
      debtor: "John Smith",
      company: "Smith & Associates",
      amount: "$4,581",
      date: "March 15, 2024",
      duration: "3:42",
      status: "Payment Promised",
      sentiment: "Positive",
      transcript: [
        { speaker: "AI", time: "0:00", text: "Hi John, this is Sarah from DebtAI calling about your outstanding invoice of $4,581. Do you have a moment to discuss this?" },
        { speaker: "John", time: "0:08", text: "Oh hi, yes I've been meaning to call about that. We've had some cash flow issues this quarter." },
        { speaker: "AI", time: "0:15", text: "I understand cash flow can be challenging. The invoice has been outstanding for 45 days now. Can we work out a payment plan that works for your business?" },
        { speaker: "John", time: "0:27", text: "That would be great. Could we do it in two payments? Half now and half next month?" },
        { speaker: "AI", time: "0:34", text: "Absolutely! So that would be $2,290.50 by March 20th and the remaining $2,290.50 by April 20th. Does that work?" },
        { speaker: "John", time: "0:45", text: "Perfect. I'll send the first payment by the end of this week." },
        { speaker: "AI", time: "0:50", text: "Excellent! I'll send you a payment confirmation email with the details. Thank you for working with us on this, John." }
      ]
    },
    {
      id: 2,
      debtor: "Lisa Chen",
      company: "Tech Solutions Inc",
      amount: "$2,750",
      date: "March 14, 2024", 
      duration: "2:18",
      status: "Dispute Raised",
      sentiment: "Neutral",
      transcript: [
        { speaker: "AI", time: "0:00", text: "Hello Lisa, this is calling from DebtAI regarding invoice #INV-2024-0312 for $2,750." },
        { speaker: "Lisa", time: "0:07", text: "Hi there. Actually, I need to discuss this invoice. We never received the services listed." },
        { speaker: "AI", time: "0:14", text: "I'm sorry to hear about this issue. Let me help you resolve this. Can you tell me more about what services were expected versus what was delivered?" },
        { speaker: "Lisa", time: "0:25", text: "We paid for premium support but only received basic support. The contract clearly states 24/7 availability but we couldn't reach anyone on weekends." },
        { speaker: "AI", time: "0:38", text: "I understand your concern. This sounds like a legitimate service delivery issue. I'll escalate this to our billing disputes team and have them review your account within 24 hours." },
        { speaker: "Lisa", time: "0:52", text: "That sounds fair. I appreciate you taking this seriously instead of just pushing for payment." }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
            AI Call Transcriptions
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Review every conversation with complete transparency and AI-powered insights.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Call List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Calls</h2>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {callTranscripts.map((call, index) => (
                    <div 
                      key={call.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCall === index ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
                      onClick={() => setSelectedCall(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{call.debtor}</h3>
                        <span className="text-sm text-gray-500">{call.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{call.company}</p>
                      <p className="text-sm font-semibold text-gray-900 mb-2">{call.amount}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          call.status === 'Payment Promised' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {call.status}
                        </span>
                        <span className="text-xs text-gray-500">{call.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Call with {callTranscripts[selectedCall].debtor}
                      </h2>
                      <p className="text-gray-600">{callTranscripts[selectedCall].company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-semibold">{callTranscripts[selectedCall].amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-semibold">{callTranscripts[selectedCall].duration}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-semibold">{callTranscripts[selectedCall].status}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sentiment:</span>
                      <p className="font-semibold">{callTranscripts[selectedCall].sentiment}</p>
                    </div>
                  </div>
                </div>

                {/* Transcript */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcript</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {callTranscripts[selectedCall].transcript.map((message, index) => (
                      <div key={index} className={`flex gap-4 p-3 rounded-lg ${
                        message.speaker === 'AI' ? 'bg-blue-50' : 'bg-gray-50'
                      }`}>
                        <div className="flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-500">{message.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${
                              message.speaker === 'AI' ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {message.speaker === 'AI' ? 'DebtAI' : message.speaker}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Transcriptions;
