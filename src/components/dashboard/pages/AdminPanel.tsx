
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield,
  Users,
  Key,
  CreditCard,
  Settings,
  Activity,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Database,
  Server,
  Globe,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");

  const users = [
    {
      id: 1,
      name: "John Admin",
      email: "john@company.com",
      role: "Owner",
      status: "active",
      lastLogin: "2024-01-27 09:30",
      permissions: ["all"]
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@company.com",
      role: "Manager",
      status: "active",
      lastLogin: "2024-01-27 08:15",
      permissions: ["users", "reports", "settings"]
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike@company.com",
      role: "Collector",
      status: "active",
      lastLogin: "2024-01-27 07:45",
      permissions: ["debtors", "calls"]
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa@company.com",
      role: "Viewer",
      status: "suspended",
      lastLogin: "2024-01-25 16:20",
      permissions: ["view_only"]
    }
  ];

  const accessLogs = [
    {
      id: 1,
      user: "John Admin",
      action: "User Login",
      ip: "192.168.1.100",
      location: "New York, US",
      timestamp: "2024-01-27 09:30:15",
      status: "success"
    },
    {
      id: 2,
      user: "Sarah Wilson",
      action: "Export Data",
      ip: "192.168.1.105",
      location: "New York, US",
      timestamp: "2024-01-27 08:45:32",
      status: "success"
    },
    {
      id: 3,
      user: "Unknown",
      action: "Failed Login",
      ip: "45.123.67.89",
      location: "Unknown",
      timestamp: "2024-01-27 03:22:10",
      status: "failed"
    },
    {
      id: 4,
      user: "Mike Rodriguez",
      action: "API Access",
      ip: "192.168.1.102",
      location: "New York, US",
      timestamp: "2024-01-27 07:15:44",
      status: "success"
    }
  ];

  const systemStats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600" },
    { label: "Active Sessions", value: 8, icon: Activity, color: "text-green-600" },
    { label: "API Calls Today", value: "2.4K", icon: Server, color: "text-purple-600" },
    { label: "Storage Used", value: "67%", icon: Database, color: "text-orange-600" }
  ];

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'collector': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: "users", label: "User Management", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "api", label: "API Keys", icon: Key },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "logs", label: "Access Logs", icon: Activity },
    { id: "system", label: "System Settings", icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, permissions, and system settings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button className="bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Security Alert
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Last login: {user.lastLogin}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          <span>{user.permissions.length} permissions</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Owner", users: 1, permissions: ["All permissions"], color: "purple" },
                  { name: "Manager", users: 2, permissions: ["User management", "Reports", "Settings"], color: "blue" },
                  { name: "Collector", users: 5, permissions: ["Debtor management", "Call center"], color: "green" },
                  { name: "Viewer", users: 3, permissions: ["Read-only access"], color: "gray" }
                ].map((role) => (
                  <Card key={role.name} className="border-2 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{role.name}</span>
                        <Badge variant="outline">{role.users} users</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {role.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{permission}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Permissions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">API Key Management</h3>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Key className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Production API", key: "pk_live_***************************", created: "2024-01-15", lastUsed: "2024-01-27", status: "active" },
                  { name: "Development API", key: "pk_test_***************************", created: "2024-01-10", lastUsed: "2024-01-26", status: "active" },
                  { name: "Legacy API", key: "pk_live_***************************", created: "2023-12-01", lastUsed: "2024-01-20", status: "revoked" }
                ].map((apiKey, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                        <p className="text-sm text-gray-500 font-mono">{apiKey.key}</p>
                      </div>
                      <Badge className={getStatusColor(apiKey.status)}>
                        {apiKey.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Regenerate</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Access Logs</h3>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-500">by {log.user} from {log.ip}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{log.timestamp}</p>
                        <p className="text-xs text-gray-500">{log.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
