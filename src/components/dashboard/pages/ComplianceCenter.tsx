
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Phone,
  MessageSquare,
  Users,
  Calendar,
  Settings,
  Download,
  Eye
} from "lucide-react";

export const ComplianceCenter = () => {
  const [selectedRule, setSelectedRule] = useState("");

  const complianceMetrics = {
    overallScore: 94,
    totalChecks: 1247,
    violations: 7,
    warnings: 23,
    lastAudit: "2024-01-25"
  };

  const complianceRules = [
    {
      id: "fdcpa_001",
      name: "FDCPA Call Hours",
      description: "Calls only between 8 AM - 9 PM debtor's local time",
      status: "compliant",
      lastCheck: "2024-01-27 15:30",
      violations: 0,
      category: "timing"
    },
    {
      id: "fdcpa_002", 
      name: "Disclosure Requirements",
      description: "Required debt collection disclosure in initial communication",
      status: "compliant",
      lastCheck: "2024-01-27 14:20",
      violations: 0,
      category: "disclosure"
    },
    {
      id: "tcpa_001",
      name: "TCPA Consent",
      description: "Written consent for automated calls/texts",
      status: "warning",
      lastCheck: "2024-01-27 13:15",
      violations: 2,
      category: "consent"
    },
    {
      id: "state_001",
      name: "State Licensing",
      description: "Valid collection license in debtor's state",
      status: "compliant",
      lastCheck: "2024-01-27 12:00",
      violations: 0,
      category: "licensing"
    }
  ];

  const auditLogs = [
    {
      id: "audit_001",
      timestamp: "2024-01-27 15:45",
      type: "call_hours_check",
      result: "passed",
      details: "Call initiated at 2:30 PM - within allowed hours",
      agentId: "core-debt-001",
      debtorId: "debtor_123"
    },
    {
      id: "audit_002",
      timestamp: "2024-01-27 15:30",
      type: "disclosure_check",
      result: "passed",
      details: "Required disclosure provided in initial contact",
      agentId: "core-debt-001",
      debtorId: "debtor_124"
    },
    {
      id: "audit_003",
      timestamp: "2024-01-27 15:15",
      type: "consent_check",
      result: "warning",
      details: "SMS sent without explicit written consent",
      agentId: "reminder-001",
      debtorId: "debtor_125"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'violation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'violation': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'timing': return <Clock className="h-5 w-5" />;
      case 'disclosure': return <FileText className="h-5 w-5" />;
      case 'consent': return <Users className="h-5 w-5" />;
      case 'licensing': return <Shield className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
        <p className="text-gray-600">Monitor regulatory compliance and audit trails</p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40 * (complianceMetrics.overallScore / 100)} ${2 * Math.PI * 40}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{complianceMetrics.overallScore}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Overall Compliance Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Checks</p>
                <p className="text-2xl font-bold">{complianceMetrics.totalChecks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Violations</p>
                <p className="text-2xl font-bold text-red-600">{complianceMetrics.violations}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceMetrics.warnings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Rules */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Rules
          </CardTitle>
          <CardDescription>
            Monitor adherence to regulatory requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceRules.map((rule) => {
              const CategoryIcon = getCategoryIcon(rule.category);
              return (
                <div key={rule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                        <p className="text-xs text-gray-500">Last checked: {rule.lastCheck}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-red-600">{rule.violations}</p>
                        <p className="text-xs text-gray-500">violations</p>
                      </div>
                      
                      <Badge className={`flex items-center gap-1 ${getStatusColor(rule.status)}`}>
                        {getStatusIcon(rule.status)}
                        {rule.status}
                      </Badge>

                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>
            Real-time compliance monitoring and audit logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.result === 'passed' ? 'bg-green-100' :
                    log.result === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {log.result === 'passed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{log.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-xs text-gray-600">{log.details}</p>
                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {log.agentId}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Audit Log
            </Button>
            <Button variant="outline">
              View All Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
