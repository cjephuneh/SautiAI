
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/services/api";
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Phone,
  Mail,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";

export const Settings = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone_number: '',
    company: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    callReminders: true,
    paymentAlerts: true,
    dailySummary: true
  });
  
  // Calling preferences
  const [callingSettings, setCallingSettings] = useState({
    callerId: '+1 (800) 555-DEBT',
    voicemailScript: 'Hello, this is a message from SautiAI regarding your account. Please call us back at your earliest convenience at 1-800-555-DEBT.',
    aiVoiceCalls: true,
    callRecording: true,
    complianceMonitoring: true
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    try {
      // Here you would call an API to update the profile
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      
      // Refresh user data
      await refreshUser();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Here you would call an API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

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
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
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
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Call Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders for scheduled calls</p>
                  </div>
                  <Switch 
                    checked={notifications.callReminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, callReminders: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Alerts</h3>
                    <p className="text-sm text-gray-500">Notifications for received payments</p>
                  </div>
                  <Switch 
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, paymentAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Daily Summary</h3>
                    <p className="text-sm text-gray-500">Daily performance summary email</p>
                  </div>
                  <Switch 
                    checked={notifications.dailySummary}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, dailySummary: checked }))}
                  />
                </div>
              </div>
              
              <Button onClick={() => toast({ title: "Preferences Saved", description: "Your notification preferences have been updated." })}>
                Save Preferences
              </Button>
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
                  <Input 
                    id="callerId" 
                    value={callingSettings.callerId}
                    onChange={(e) => setCallingSettings(prev => ({ ...prev, callerId: e.target.value }))}
                    placeholder="Enter caller ID number"
                  />
                  <p className="text-sm text-gray-500">The number that appears when making calls</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voicemail">Voicemail Script</Label>
                  <Textarea 
                    id="voicemail" 
                    rows={4}
                    value={callingSettings.voicemailScript}
                    onChange={(e) => setCallingSettings(prev => ({ ...prev, voicemailScript: e.target.value }))}
                    placeholder="Enter your voicemail script"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">AI Voice Calls</h3>
                    <p className="text-sm text-gray-500">Enable AI-powered automated calling</p>
                  </div>
                  <Switch 
                    checked={callingSettings.aiVoiceCalls}
                    onCheckedChange={(checked) => setCallingSettings(prev => ({ ...prev, aiVoiceCalls: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Call Recording</h3>
                    <p className="text-sm text-gray-500">Record calls for quality assurance</p>
                  </div>
                  <Switch 
                    checked={callingSettings.callRecording}
                    onCheckedChange={(checked) => setCallingSettings(prev => ({ ...prev, callRecording: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compliance Monitoring</h3>
                    <p className="text-sm text-gray-500">AI compliance checking during calls</p>
                  </div>
                  <Switch 
                    checked={callingSettings.complianceMonitoring}
                    onCheckedChange={(checked) => setCallingSettings(prev => ({ ...prev, complianceMonitoring: checked }))}
                  />
                </div>
              </div>
              
              <Button onClick={() => toast({ title: "Configuration Saved", description: "Your calling settings have been updated." })}>
                Save Configuration
              </Button>
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
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                    minLength={8}
                    required
                  />
                  <p className="text-sm text-gray-500">Password must be at least 8 characters long</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    required
                  />
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
                
                <div className="flex gap-3">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                  <Button variant="outline" type="button">
                    Setup 2FA
                  </Button>
                </div>
              </form>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({ title: "Email Service", description: "Email integration configuration opened." })}
                  >
                    Configure
                  </Button>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({ title: "Phone System", description: "Phone system configuration opened." })}
                  >
                    Configure
                  </Button>
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
                  <Button 
                    size="sm"
                    onClick={() => toast({ title: "CRM System", description: "CRM integration setup started." })}
                  >
                    Connect
                  </Button>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({ title: "Payment Method", description: "Payment method update opened." })}
                  >
                    Update
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => toast({ title: "Change Plan", description: "Plan change options opened." })}
                >
                  Change Plan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast({ title: "Billing History", description: "Billing history opened." })}
                >
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
