
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Phone,
  Mail,
  Save,
  Loader2
} from "lucide-react";

export const Settings = () => {
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone_number: '',
    company: ''
  });

  useEffect(() => {
    console.log('Settings: User data changed:', user);
    console.log('Settings: Auth loading state:', isLoading);
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        company: user.company || ''
      });
    }
  }, [user, isLoading]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show error if no user (shouldn't happen if properly authenticated)
  if (!user && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">You are not authenticated. Please log in again.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings & Configuration</h2>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calling">Calling</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profileData.phone_number}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Call Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders for scheduled calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Alerts</h3>
                    <p className="text-sm text-gray-500">Notifications for received payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Daily Summary</h3>
                    <p className="text-sm text-gray-500">Daily performance summary email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Calling Configuration
              </CardTitle>
              <CardDescription>Configure your calling system and AI settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="callerId">Caller ID Number</Label>
                  <Input id="callerId" defaultValue="+1 (800) 555-DEBT" />
                  <p className="text-sm text-gray-500">The number that appears when making calls</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voicemail">Voicemail Script</Label>
                  <Textarea 
                    id="voicemail" 
                    rows={4}
                    defaultValue="Hello, this is a message from SautiAI regarding your account. Please call us back at your earliest convenience at 1-800-555-DEBT."
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">AI Voice Calls</h3>
                    <p className="text-sm text-gray-500">Enable AI-powered automated calling</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Call Recording</h3>
                    <p className="text-sm text-gray-500">Record calls for quality assurance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compliance Monitoring</h3>
                    <p className="text-sm text-gray-500">AI compliance checking during calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified of new logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button>Update Password</Button>
                <Button variant="outline">Setup 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>Connect with external services and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Service</h3>
                      <p className="text-sm text-gray-500">Connected to Gmail</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone System</h3>
                      <p className="text-sm text-gray-500">Twilio Integration</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">CRM System</h3>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Professional Plan</h3>
                <p className="text-blue-700">$199/month • Up to 10,000 contacts</p>
                <p className="text-sm text-blue-600 mt-1">Next billing date: February 15, 2024</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/26</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Billing History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
