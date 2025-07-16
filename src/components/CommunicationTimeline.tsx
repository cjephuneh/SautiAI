import { Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunicationTimeline = () => {
  const communications = [
    {
      type: "EMAIL",
      icon: Mail,
      time: "7d ago",
      title: "Action Required: Ksh4,581 Overdue Balance",
      status: "sent",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      type: "EMAIL", 
      icon: Mail,
      time: "5d ago",
      title: "Urgent: Outstanding Payment of Ksh4,581",
      status: "opened",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      type: "WHATSAPP",
      icon: MessageSquare,
      time: "2h ago",
      title: "WhatsApp: Please settle your overdue Ksh4,581",
      status: "sent",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      type: "EMAIL",
      icon: Mail,
      time: "4d ago", 
      title: "Immediate Attention Needed: Ksh4,581 Past...",
      status: "sent",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      type: "PHONE",
      icon: Phone,
      time: "4d ago",
      title: "New Voicemail: Hi Doug, following up on Ksh4,581...",
      status: "completed",
      bgColor: "bg-green-100", 
      iconColor: "text-green-600"
    },
    {
      type: "EMAIL",
      icon: Mail,
      time: "3d ago",
      title: "Resolve Your Ksh4,581 Overdue Invoice Today",
      status: "sent",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      type: "PHONE",
      icon: Phone,
      time: "14h ago",
      title: "New Voicemail: Doug, we need your immediate attention...",
      status: "completed",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      type: "EMAIL",
      icon: Mail,
      time: "6h ago", 
      title: "Overdue Notice: Ksh4,581 Payment Required",
      status: "sent",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    }
    
  ];

  return (
    <div className=" rounded-2xl p-8   ">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Sending multiple notices and getting ghosted?
        </h2>
        <p className="text-gray-600 text-lg">
          Your team excels at closing late payments, but a few remain stubborn.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-3 ">
        {communications.map((comm, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors bg-white  shadow-2xl border border-gray-100">
            <div className={`w-10 h-10 rounded-lg ${comm.bgColor} flex items-center justify-center`}>
              <comm.icon className={`w-5 h-5 ${comm.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {comm.type}
                </span>
                <span className="text-xs text-gray-400">{comm.time}</span>
              </div>
              <p className="text-sm text-gray-900 font-medium truncate">
                {comm.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
          Let SautiAI Take Over
        </Button>
      </div>
    </div>
  );
};

export default CommunicationTimeline;
