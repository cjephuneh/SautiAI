import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Calendar,
  Database,
  Mail,
  MessageSquare,
  Phone,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  Zap,
  Link,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Key,
  Globe,
  Webhook,
  Code,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: any;
  color: string;
  features: string[];
  last_sync: string;
  config: Record<string, any>;
  webhook_url?: string;
  api_key?: string;
}

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockIntegrations: Integration[] = [
        {
          id: "1",
          name: "Salesforce CRM",
          description: "Sync contacts and manage leads in Salesforce",
          category: "CRM",
          provider: "salesforce",
          status: "connected",
          icon: Database,
          color: "text-blue-600 bg-blue-100",
          features: ["Contact Sync", "Lead Management", "Opportunity Tracking"],
          last_sync: "2024-01-27T10:30:00Z",
          config: { instance_url: "https://mycompany.salesforce.com" },
          api_key: "sk_test_***************"
        },
        {
          id: "2",
          name: "Google Calendar",
          description: "Schedule callbacks and manage appointments",
          category: "Calendar",
          provider: "google",
          status: "connected",
          icon: Calendar,
          color: "text-green-600 bg-green-100",
          features: ["Event Creation", "Callback Scheduling", "Availability Check"],
          last_sync: "2024-01-27T09:15:00Z",
          config: { calendar_id: "primary" }
        },
        {
          id: "3",
          name: "Microsoft Outlook",
          description: "Email automation and calendar integration",
          category: "Email",
          provider: "microsoft",
          status: "disconnected",
          icon: Mail,
          color: "text-purple-600 bg-purple-100",
          features: ["Email Templates", "Auto-responses", "Calendar Sync"],
          last_sync: "",
          config: {}
        },
        {
          id: "4",
          name: "Stripe",
          description: "Payment processing and invoicing",
          category: "Payments",
          provider: "stripe",
          status: "connected",
          icon: CreditCard,
          color: "text-indigo-600 bg-indigo-100",
          features: ["Payment Links", "Subscription Management", "Invoice Generation"],
          last_sync: "2024-01-27T08:45:00Z",
          config: { publishable_key: "pk_test_***************" },
          api_key: "sk_test_***************"
        },
        {
          id: "5",
          name: "Slack",
          description: "Team notifications and alerts",
          category: "Communication",
          provider: "slack",
          status: "error",
          icon: MessageSquare,
          color: "text-pink-600 bg-pink-100",
          features: ["Call Notifications", "Daily Reports", "Team Alerts"],
          last_sync: "2024-01-26T18:20:00Z",
          config: { channel: "#collections" },
          webhook_url: "https://hooks.slack.com/services/***"
        },
        {
          id: "6",
          name: "Twilio",
          description: "SMS and voice communication",
          category: "Communication",
          provider: "twilio",
          status: "connected",
          icon: Phone,
          color: "text-red-600 bg-red-100",
          features: ["SMS Campaigns", "Voice Calls", "Phone Number Management"],
          last_sync: "2024-01-27T11:00:00Z",
          config: { account_sid: "AC***************" },
          api_key: "SK***************"
        },
        {
          id: "7",
          name: "HubSpot",
          description: "Marketing automation and CRM",
          category: "CRM",
          provider: "hubspot",
          status: "pending",
          icon: Users,
          color: "text-orange-600 bg-orange-100",
          features: ["Contact Management", "Deal Tracking", "Email Marketing"],
          last_sync: "",
          config: {}
        },
        {
          id: "8",
          name: "Zapier",
          description: "Workflow automation and app connections",
          category: "Automation",
          provider: "zapier",
          status: "disconnected",
          icon: Zap,
          color: "text-yellow-600 bg-yellow-100",
          features: ["Workflow Automation", "App Connections", "Trigger Events"],
          last_sync: "",
          config: {}
        }
      ];
      
      setIntegrations(mockIntegrations);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
      toast({
        title: "Error",
        description: "Failed to load integrations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Integrations", icon: Globe },
    { id: "CRM", name: "CRM", icon: Database },
    { id: "Calendar", name: "Calendar", icon: Calendar },
    { id: "Email", name: "Email", icon: Mail },
    { id: "Communication", name: "Communication", icon: MessageSquare },
    { id: "Payments", name: "Payments", icon: CreditCard },
    { id: "Automation", name: "Automation", icon: Zap },
    { id: "Analytics", name: "Analytics", icon: BarChart3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-green-600 bg-green-100";
      case "disconnected": return "text-gray-600 bg-gray-100";
      case "error": return "text-red-600 bg-red-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected": return <XCircle className="h-4 w-4 text-gray-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending": return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleConnect = async (integration: Integration) => {
    try {
      // Mock API call
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: "pending" as const }
          : int
      ));

      // Simulate connection delay
      setTimeout(() => {
        setIntegrations(prev => prev.map(int => 
          int.id === integration.id 
            ? { ...int, status: "connected" as const, last_sync: new Date().toISOString() }
            : int
        ));
        
        toast({
          title: "Success",
          description: `${integration.name} connected successfully.`,
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect ${integration.name}.`,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    try {
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: "disconnected" as const }
          : int
      ));
      
      toast({
        title: "Success",
        description: `${integration.name} disconnected successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to disconnect ${integration.name}.`,
        variant: "destructive",
      });
    }
  };

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === "all" || integration.category === selectedCategory
  );

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === "connected").length,
    pending: integrations.filter(i => i.status === "pending").length,
    errors: integrations.filter(i => i.status === "error").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Connect your favorite tools and automate workflows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">{stats.connected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Loader2 className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    selectedCategory === category.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${integration.color}`}>
                          <integration.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{integration.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {integration.last_sync && (
                        <div>
                          <p className="text-xs text-gray-500">
                            Last sync: {new Date(integration.last_sync).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setShowConfigModal(true);
                              }}
                              className="flex-1"
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDisconnect(integration)}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(integration)}
                            disabled={integration.status === "pending"}
                            className="flex-1"
                          >
                            {integration.status === "pending" ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Link className="h-4 w-4 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <selectedIntegration.icon className="h-5 w-5" />
                Configure {selectedIntegration.name}
              </DialogTitle>
              <DialogDescription>
                Manage settings and authentication for this integration
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Integration Name</Label>
                    <Input defaultValue={selectedIntegration.name} />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea defaultValue={selectedIntegration.description} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Integration</Label>
                      <p className="text-sm text-gray-500">
                        Turn this integration on or off
                      </p>
                    </div>
                    <Switch defaultChecked={selectedIntegration.status === "connected"} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync</Label>
                      <p className="text-sm text-gray-500">
                        Automatically sync data every hour
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auth" className="space-y-4">
                <div className="space-y-4">
                  {selectedIntegration.api_key && (
                    <div>
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input type="password" defaultValue={selectedIntegration.api_key} />
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Connection Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedIntegration.status)}
                      <span className="capitalize">{selectedIntegration.status}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Last Authentication</Label>
                    <Input defaultValue={new Date().toLocaleString()} disabled />
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Webhook URL</Label>
                    <Input 
                      defaultValue={selectedIntegration.webhook_url || ""}
                      placeholder="https://your-app.com/webhooks/integration"
                    />
                  </div>

                  <div>
                    <Label>Events</Label>
                    <div className="space-y-2 mt-2">
                      {['call.completed', 'payment.received', 'contact.updated'].map((event) => (
                        <div key={event} className="flex items-center justify-between">
                          <span className="text-sm">{event}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Webhook className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Integrations;
