import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Phone, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  BarChart3,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  PhoneOff,
  Eye,
  FileText,
  Play,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardApi, analyticsApi, contactsApi, callsApi } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const DEFAULT_USER_ID = 12345; // Changed from string to number

export const Overview = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [accountUsage, setAccountUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveTranscriptCall, setLiveTranscriptCall] = useState<any>(null);
  const [showLiveTranscript, setShowLiveTranscript] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchActiveCalls();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [summary, activeCallsRes, collectionPerf, usageRes, callsRes] = await Promise.allSettled([
        dashboardApi.getSummary(),
        dashboardApi.getActiveCalls(),
        analyticsApi.getCollectionPerformance(),
        dashboardApi.getAccountUsage(),
        callsApi.getCalls(1)
      ]);

      if (summary.status === 'fulfilled') {
        setDashboardData(summary.value);
      } else {
        console.error("Failed to fetch dashboard summary:", summary.reason);
        setDashboardData(null);
      }

      if (activeCallsRes.status === 'fulfilled') {
        setActiveCalls(Array.isArray(activeCallsRes.value) ? activeCallsRes.value : []);
      } else {
        console.error("Failed to fetch active calls:", activeCallsRes.reason);
        setActiveCalls([]);
      }

      if (collectionPerf.status === 'fulfilled') {
        setPerformanceData(collectionPerf.value);
      } else {
        console.error("Failed to fetch performance data:", collectionPerf.reason);
        setPerformanceData(null);
      }

      if (usageRes.status === 'fulfilled') {
        setAccountUsage(usageRes.value);
      } else {
        console.error("Failed to fetch account usage:", usageRes.reason);
        setAccountUsage(null);
      }

      if (callsRes.status === 'fulfilled') {
        const callsArr = Array.isArray(callsRes.value) ? callsRes.value : [];
        setRecentCalls(callsArr.slice(0, 5));
        setCallLogs(callsArr.slice(0, 5));
      } else {
        console.error("Failed to fetch call logs:", callsRes.reason);
        setRecentCalls([]);
        setCallLogs([]);
      }

    } catch (error) {
      console.error("Unexpected error in fetchDashboardData:", error);
      setError("Unable to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCalls = async () => {
    try {
      const data = await dashboardApi.getActiveCalls();
      setActiveCalls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch active calls:", error);
    }
  };

  const openLiveTranscript = (call: any) => {
    setLiveTranscriptCall(call);
    setShowLiveTranscript(true);
    setAutoRefresh(true);
  };

  const handlePlayRecording = (url: string) => {
    setAudioUrl(url);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 100); // slight delay to ensure ref is set
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const getMinutesColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const stats = dashboardData || {
    total_contacts: 0,
    active_campaigns: 0,
    calls_today: 0,
    collection_rate: 0,
    total_collected: 0,
    pending_calls: 0,
    successful_calls: 0,
    failed_calls: 0
  };

  const usage = accountUsage || {
    minutes_remaining: 0,
    minutes_used: 0,
    total_minutes: 0,
    plan_name: "No Plan Data",
    renewal_date: new Date().toISOString(),
    cost_per_minute: 0
  };

  const dashboardMetrics = [
    {
      label: "Total Calls Today",
      value: stats.calls_today || 0,
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Minutes Remaining",
      value: formatMinutesToHours(usage.minutes_remaining || 0),
      icon: Clock,
      color: getMinutesColor(usage.minutes_remaining || 0, usage.total_minutes || 1),
      bgColor: (usage.minutes_remaining || 0) > (usage.total_minutes || 1) * 0.5 ? "bg-green-50" : 
                (usage.minutes_remaining || 0) > (usage.total_minutes || 1) * 0.25 ? "bg-yellow-50" : "bg-red-50",
      subtitle: `${Math.round(((usage.minutes_remaining || 0) / (usage.total_minutes || 1)) * 100)}% of plan`
    },
    {
      label: "Total Contacts",
      value: stats.total_contacts || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Total Debt Amount",
      value: `KSh ${(stats.total_collected || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const performanceMetrics = [
    {
      label: "Successful Calls",
      value: stats.successful_calls || 0,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: "Failed Calls",
      value: stats.failed_calls || 0,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      label: "Collection Rate",
      value: `${stats.collection_rate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!dashboardData && !loading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Dashboard Data Unavailable</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Unable to load dashboard statistics. Please ensure your API server is running and try refreshing.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={fetchDashboardData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}

      {!accountUsage && !loading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Usage Data Unavailable</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Unable to load account usage information. Please ensure your API server is running.
            </p>
          </CardContent>
        </Card>
      )}

      {accountUsage && usage.minutes_remaining < usage.total_minutes * 0.1 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Low Minutes Warning</span>
            </div>
            <p className="text-red-600 text-sm mt-1">
              You have only {formatMinutesToHours(usage.minutes_remaining)} left. 
              Your plan renews on {new Date(usage.renewal_date).toLocaleDateString()}.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
            >
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.label} className="border-0 shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  {metric.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account Usage Details
          </CardTitle>
          <CardDescription>Your current plan usage and billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-lg font-semibold text-gray-900">{usage.plan_name || 'No Plan'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Plan Renewal</p>
                <p className="text-sm text-gray-700">
                  {usage.renewal_date ? new Date(usage.renewal_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cost per Minute</p>
                <p className="text-sm text-gray-700">${(usage.cost_per_minute || 0).toFixed(3)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Minutes Used</p>
                <p className="text-lg font-semibold text-gray-900">{formatMinutesToHours(usage.minutes_used || 0)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Minutes Remaining</p>
                <p className={`text-lg font-semibold ${getMinutesColor(usage.minutes_remaining || 0, usage.total_minutes || 1)}`}>
                  {formatMinutesToHours(usage.minutes_remaining || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plan Minutes</p>
                <p className="text-sm text-gray-700">{formatMinutesToHours(usage.total_minutes || 0)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Usage Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      (usage.minutes_remaining || 0) > (usage.total_minutes || 1) * 0.5 ? 'bg-green-500' :
                      (usage.minutes_remaining || 0) > (usage.total_minutes || 1) * 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${((usage.minutes_used || 0) / (usage.total_minutes || 1)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(((usage.minutes_used || 0) / (usage.total_minutes || 1)) * 100)}% used
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Current Bill</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${((usage.minutes_used || 0) * (usage.cost_per_minute || 0)).toFixed(2)}
                </p>
              </div>

              <Button variant="outline" className="w-full mt-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Usage Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>Key performance indicators for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Active Calls
                {activeCalls.length > 0 && (
                  <Badge className="bg-red-100 text-red-800 animate-pulse">
                    {activeCalls.length} LIVE
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-blue-100 border-blue-300' : ''}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
            <CardDescription>Currently ongoing calls with real-time monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCalls.length === 0 ? (
              <div className="text-center py-8">
                <PhoneOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active calls</p>
                <p className="text-sm text-gray-400">Calls will appear here when agents are speaking with contacts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div key={call.id || call.call_id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <PhoneCall className="h-5 w-5 text-blue-600 animate-pulse" />
                        </div>
                        <div>
                          <p className="font-medium">{call.contact_name || "Unknown Contact"}</p>
                          <p className="text-sm text-gray-600">{call.phone_number}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {call.status || 'Active'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Agent: {call.agent_name || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {call.duration || '00:00'}
                          </p>
                          <p className="text-xs text-gray-500">duration</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => openLiveTranscript(call)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Live
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live conversation in progress</span>
                      <span className="ml-auto">
                        Started: {new Date(call.start_time || call.started_at || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Calls
            </CardTitle>
            <CardDescription>Latest call activity and transcripts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentCalls.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent calls</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCalls.map((call) => (
                      <TableRow 
                        key={call.id || call.call_id} 
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.contact_name || "Unknown"}</p>
                            <p className="text-sm text-gray-600">{call.phone_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs font-medium border", getStatusColor(call.status))}>
                            {call.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(call.duration || 0)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {call.transcript && (
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3" />
                              </Button>
                            )}
                            {call.recording_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePlayRecording(call.recording_url)}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Audio player (hidden, but will play when Play is clicked) */}
                <audio
                  ref={audioRef}
                  src={audioUrl || undefined}
                  style={{ display: "none" }}
                  onEnded={() => setAudioUrl(null)}
                  controls
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {liveTranscriptCall && (
        <Dialog open={showLiveTranscript} onOpenChange={setShowLiveTranscript}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                Live Call Monitor
                <Badge className="bg-red-100 text-red-800 animate-pulse">
                  LIVE
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Real-time monitoring for {liveTranscriptCall.contact_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <PhoneCall className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium">Call in Progress</p>
                <p className="text-sm text-gray-600 mt-2">
                  Connect to the Call Logs page for full live transcript functionality
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setShowLiveTranscript(false);
                  }}
                >
                  View Full Transcript
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{liveTranscriptCall.duration || '00:00'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Agent</p>
                  <p className="font-semibold">{liveTranscriptCall.agent_name}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">
                    {liveTranscriptCall.status}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
