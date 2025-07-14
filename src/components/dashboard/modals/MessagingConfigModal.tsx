
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Settings, Key, Save, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { communicationService } from "@/services/communicationService";

interface MessagingConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MessagingConfigModal = ({ open, onOpenChange }: MessagingConfigModalProps) => {
  const [whatsappConfig, setWhatsappConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: ''
  });
  
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });

  const [testMessage, setTestMessage] = useState({
    phoneNumber: '',
    message: 'Test message from SautiAI'
  });

  const { toast } = useToast();

  const handleWhatsAppTest = async () => {
    try {
      await communicationService.sendWhatsAppMessage(
        {
          to: testMessage.phoneNumber,
          type: 'text',
          text: { body: testMessage.message }
        },
        whatsappConfig.accessToken
      );
      
      toast({
        title: "Test Successful",
        description: "WhatsApp test message sent successfully"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send WhatsApp test message",
        variant: "destructive"
      });
    }
  };

  const handleSMSTest = async () => {
    try {
      await communicationService.sendSMS(
        {
          to: testMessage.phoneNumber,
          body: testMessage.message,
          from: twilioConfig.phoneNumber
        },
        twilioConfig.accountSid,
        twilioConfig.authToken
      );
      
      toast({
        title: "Test Successful",
        description: "SMS test message sent successfully"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send SMS test message",
        variant: "destructive"
      });
    }
  };

  const saveConfiguration = () => {
    // In a real app, this would save to your backend/database
    localStorage.setItem('whatsapp_config', JSON.stringify(whatsappConfig));
    localStorage.setItem('twilio_config', JSON.stringify(twilioConfig));
    
    toast({
      title: "Configuration Saved",
      description: "Your messaging configuration has been saved"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Messaging Configuration
          </DialogTitle>
          <DialogDescription>
            Configure WhatsApp Business API and SMS automation settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp">WhatsApp Business</TabsTrigger>
            <TabsTrigger value="sms">SMS (Twilio)</TabsTrigger>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  WhatsApp Business API Configuration
                </CardTitle>
                <CardDescription>
                  Connect your WhatsApp Business account to send messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wa-token">Access Token</Label>
                    <Input
                      id="wa-token"
                      type="password"
                      placeholder="Your WhatsApp Business API token"
                      value={whatsappConfig.accessToken}
                      onChange={(e) => setWhatsappConfig({...whatsappConfig, accessToken: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wa-phone-id">Phone Number ID</Label>
                    <Input
                      id="wa-phone-id"
                      placeholder="Your phone number ID"
                      value={whatsappConfig.phoneNumberId}
                      onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumberId: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wa-business-id">Business Account ID</Label>
                  <Input
                    id="wa-business-id"
                    placeholder="Your WhatsApp Business Account ID"
                    value={whatsappConfig.businessAccountId}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, businessAccountId: e.target.value})}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Create a WhatsApp Business account</li>
                    <li>Set up a Facebook App and get API access</li>
                    <li>Add your phone number to the WhatsApp Business API</li>
                    <li>Get your access token and phone number ID</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Twilio SMS Configuration
                </CardTitle>
                <CardDescription>
                  Configure Twilio for SMS messaging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-sid">Account SID</Label>
                    <Input
                      id="twilio-sid"
                      placeholder="Your Twilio Account SID"
                      value={twilioConfig.accountSid}
                      onChange={(e) => setTwilioConfig({...twilioConfig, accountSid: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-token">Auth Token</Label>
                    <Input
                      id="twilio-token"
                      type="password"
                      placeholder="Your Twilio Auth Token"
                      value={twilioConfig.authToken}
                      onChange={(e) => setTwilioConfig({...twilioConfig, authToken: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
                  <Input
                    id="twilio-phone"
                    placeholder="+1234567890"
                    value={twilioConfig.phoneNumber}
                    onChange={(e) => setTwilioConfig({...twilioConfig, phoneNumber: e.target.value})}
                  />
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Setup Instructions:</h4>
                  <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                    <li>Create a Twilio account</li>
                    <li>Purchase a phone number</li>
                    <li>Get your Account SID and Auth Token from the console</li>
                    <li>Verify your sending phone number</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Templates</CardTitle>
                  <CardDescription>Pre-approved message templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {communicationService.getWhatsAppTemplates().map((template, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{template.displayName}</span>
                        <Badge variant="outline">Template</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.content}</p>
                      <div className="flex gap-1">
                        {template.variables.map((variable, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SMS Templates</CardTitle>
                  <CardDescription>Quick SMS message templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {communicationService.getSMSTemplates().map((template, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{template.displayName}</span>
                        <Badge variant="outline">SMS</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.content}</p>
                      <div className="flex gap-1">
                        {template.variables.map((variable, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Test Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-phone">Test Phone Number</Label>
                <Input
                  id="test-phone"
                  placeholder="+1234567890"
                  value={testMessage.phoneNumber}
                  onChange={(e) => setTestMessage({...testMessage, phoneNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-message">Test Message</Label>
                <Input
                  id="test-message"
                  placeholder="Test message"
                  value={testMessage.message}
                  onChange={(e) => setTestMessage({...testMessage, message: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleWhatsAppTest} variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test WhatsApp
              </Button>
              <Button onClick={handleSMSTest} variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Test SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveConfiguration} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
