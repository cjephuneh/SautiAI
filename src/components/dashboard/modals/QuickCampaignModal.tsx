
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Filter,
  Calendar as CalendarIcon,
  Send,
  Clock,
  Target
} from "lucide-react";

interface QuickCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickCampaignModal = ({ open, onOpenChange }: QuickCampaignModalProps) => {
  const [campaignType, setCampaignType] = useState("whatsapp");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);

  const campaignTypes = [
    {
      id: "whatsapp",
      name: "WhatsApp Campaign",
      icon: MessageSquare,
      description: "Send WhatsApp messages to debtors",
      color: "text-green-600"
    },
    {
      id: "sms",
      name: "SMS Campaign",
      icon: Phone,
      description: "Send SMS reminders to debtors",
      color: "text-blue-600"
    },
    {
      id: "email",
      name: "Email Campaign",
      icon: Mail,
      description: "Send email notifications to debtors",
      color: "text-purple-600"
    },
    {
      id: "voice",
      name: "AI Voice Campaign",
      icon: Phone,
      description: "Automated AI voice calls to debtors",
      color: "text-orange-600"
    }
  ];

  const messageTemplates = {
    whatsapp: [
      "Hi {name}, this is a friendly reminder about your outstanding payment of ${amount}. Please contact us to discuss payment options. 😊",
      "Dear {name}, your payment of ${amount} is now overdue. Please contact us immediately to resolve this matter.",
      "Hi {name}, we'd like to offer you a settlement option for your outstanding balance of ${amount}. Let's find a solution that works for you."
    ],
    sms: [
      "Payment reminder: ${amount} due. Call (555) 123-4567 to discuss options. Reply STOP to opt out.",
      "URGENT: ${amount} payment overdue. Contact us today to avoid collection action.",
      "Payment plan available for ${amount} balance. Call (555) 123-4567 to discuss."
    ],
    email: [
      "Dear {name}, this is a reminder about your outstanding balance of ${amount}. Please contact us to arrange payment.",
      "Your account balance of ${amount} requires immediate attention. Please call our office to discuss payment options.",
      "We're here to help you resolve your balance of ${amount}. Contact us to set up a payment plan."
    ]
  };

  const debtorFilters = [
    { id: "overdue", label: "Overdue Payments", count: 145 },
    { id: "high-amount", label: "High Amount (>$1000)", count: 89 },
    { id: "no-contact", label: "No Recent Contact", count: 67 },
    { id: "payment-plan", label: "In Payment Plan", count: 34 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Campaign Launch
          </DialogTitle>
          <DialogDescription>
            Create and launch a targeted communication campaign
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Campaign Setup</TabsTrigger>
            <TabsTrigger value="targeting">Audience Targeting</TabsTrigger>
            <TabsTrigger value="review">Review & Launch</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Type</CardTitle>
                <CardDescription>Choose how you want to reach your debtors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {campaignTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        campaignType === type.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                      }`}
                      onClick={() => setCampaignType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className={`h-6 w-6 ${type.color}`} />
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input placeholder="Monthly Payment Reminder - January 2024" />
                </div>

                <div className="space-y-2">
                  <Label>Message Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignType && messageTemplates[campaignType as keyof typeof messageTemplates]?.map((template, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Template {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Custom Message</Label>
                  <Textarea
                    placeholder="Customize your message here..."
                    rows={4}
                    defaultValue={campaignType && messageTemplates[campaignType as keyof typeof messageTemplates]?.[0]}
                  />
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Variables: {"{name}"}, {"{amount}"}, {"{due_date}"}</Badge>
                  </div>
                </div>

                {campaignType === "voice" && (
                  <div className="space-y-2">
                    <Label>AI Voice Settings</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select defaultValue="aria">
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aria">Aria (Professional)</SelectItem>
                          <SelectItem value="sarah">Sarah (Friendly)</SelectItem>
                          <SelectItem value="roger">Roger (Authoritative)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="professional">
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="firm">Firm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="schedule" />
                  <Label htmlFor="schedule">Schedule for later</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Send Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Send Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Audience
                </CardTitle>
                <CardDescription>Select which debtors to include in this campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Quick Filters</h3>
                  {debtorFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={filter.id}
                          checked={selectedDebtors.includes(filter.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDebtors([...selectedDebtors, filter.id]);
                            } else {
                              setSelectedDebtors(selectedDebtors.filter(id => id !== filter.id));
                            }
                          }}
                        />
                        <Label htmlFor={filter.id} className="font-medium">{filter.label}</Label>
                      </div>
                      <Badge variant="secondary">{filter.count} debtors</Badge>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Custom Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount Range</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Min" type="number" />
                        <Input placeholder="Max" type="number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Days Overdue</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-30">0-30 days</SelectItem>
                          <SelectItem value="31-60">31-60 days</SelectItem>
                          <SelectItem value="61-90">61-90 days</SelectItem>
                          <SelectItem value="90+">90+ days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Campaign Reach</span>
                  </div>
                  <p className="text-blue-700">
                    {selectedDebtors.length > 0 
                      ? `${debtorFilters.filter(f => selectedDebtors.includes(f.id)).reduce((sum, f) => sum + f.count, 0)} debtors selected`
                      : "No filters selected - all debtors will be included"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Campaign Type</Label>
                    <p className="font-medium">
                      {campaignTypes.find(t => t.id === campaignType)?.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Target Audience</Label>
                    <p className="font-medium">
                      {selectedDebtors.length > 0 
                        ? `${debtorFilters.filter(f => selectedDebtors.includes(f.id)).reduce((sum, f) => sum + f.count, 0)} debtors`
                        : "All debtors"
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Estimated Cost</Label>
                    <p className="font-medium text-green-600">
                      {campaignType === "whatsapp" ? "$0.05" : campaignType === "sms" ? "$0.02" : campaignType === "email" ? "$0.001" : "$0.15"} per message
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Send Time</Label>
                    <p className="font-medium">
                      {scheduleDate ? format(scheduleDate, "PPP") : "Immediately"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Message Preview</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      Hi John Smith, this is a friendly reminder about your outstanding payment of $1,250.00. Please contact us to discuss payment options. 😊
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="compliance" />
                  <Label htmlFor="compliance" className="text-sm">
                    I confirm this campaign complies with TCPA and FDCPA regulations
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Send className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
