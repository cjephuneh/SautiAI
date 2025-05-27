
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, 
  Database, 
  FileSpreadsheet, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Download,
  Plus,
  Trash2
} from "lucide-react";

const IntegrationsManagement = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState([
    { id: 1, name: "Google Sheets", status: "connected", lastSync: "2 hours ago" },
    { id: 2, name: "Supabase", status: "connected", lastSync: "5 minutes ago" }
  ]);

  const availableIntegrations = [
    {
      id: "google-sheets",
      name: "Google Sheets",
      description: "Import debtor data from Google Sheets",
      icon: FileSpreadsheet,
      color: "text-green-600",
      category: "data-import"
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Sync with Airtable databases",
      icon: Database,
      color: "text-orange-600",
      category: "data-import"
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Real-time database integration",
      icon: Database,
      color: "text-green-600",
      category: "database"
    },
    {
      id: "csv-upload",
      name: "CSV Upload",
      description: "Upload debtor lists via CSV files",
      icon: Upload,
      color: "text-blue-600",
      category: "data-import"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Integrations</h1>
            <p className="text-gray-600">Connect your data sources and manage debtor imports</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Choose a data source to connect with your debt collection system
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {availableIntegrations.map((integration) => (
                  <Card key={integration.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <integration.icon className={`h-12 w-12 mx-auto mb-3 ${integration.color}`} />
                      <h3 className="font-semibold mb-2">{integration.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      <Button size="sm" className="w-full">Connect</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connected">Connected Sources</TabsTrigger>
            <TabsTrigger value="csv-import">CSV Import</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-4">
            <div className="grid gap-4">
              {connectedIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          Sync Now
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="csv-import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Debtor Data</CardTitle>
                <CardDescription>
                  Upload a CSV file with your debtor information. Make sure your file includes required fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Drop your CSV file here</p>
                  <p className="text-gray-600 mb-4">or click to browse</p>
                  <Button>Choose File</Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button className="flex-1">
                    Upload & Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Field Mapping Configuration</CardTitle>
                <CardDescription>
                  Map your data fields to the system fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { system: "Debtor Name", source: "Full Name", required: true },
                  { system: "Email", source: "Email Address", required: true },
                  { system: "Phone", source: "Phone Number", required: true },
                  { system: "Amount Owed", source: "Outstanding Balance", required: true },
                  { system: "Due Date", source: "Payment Due", required: false }
                ].map((field, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <Label className="flex items-center gap-2">
                        {field.system}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                    </div>
                    <div className="text-gray-600">→</div>
                    <div>
                      <Input defaultValue={field.source} />
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-6">Save Mapping</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegrationsManagement;
