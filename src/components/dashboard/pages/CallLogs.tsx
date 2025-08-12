import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone,
  Clock,
  User,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  Volume2,
  FileText,
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  MessageSquare,
  BarChart3,
  PhoneCall,
  PhoneOff,
  UserCheck,
  Bot,
  Eye,
  RefreshCw,
  Activity,
  Radio,
  Sparkles
} from "lucide-react";
import { callsApi, dashboardApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Call {
  call_id: number;
  contact_name: string;
  phone_number: string;
  agent_name: string;
  call_type: string;
  status: string;
  start_time: string;
  end_time?: string;
  duration?: string;
  sentiment?: string;
  caller_verified?: boolean;
  transcript?: string;
  summary?: string;
  confidence_score?: number;
  recording_url?: string;
  outcome?: string;
  created_at?: string;
  updated_at?: string;
}

const CallLogs = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7");
  const [playingCall, setPlayingCall] = useState<string | null>(null);
  const [showLiveTranscript, setShowLiveTranscript] = useState(false);
  const [liveTranscriptData, setLiveTranscriptData] = useState<any>(null);
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchCalls();
  }, [statusFilter, outcomeFilter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchActiveCalls();
        if (showLiveTranscript && selectedCall) {
          fetchLiveTranscript(selectedCall.call_id);
        }
      }, 2000); // Update every 2 seconds
      
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, showLiveTranscript, selectedCall]);

  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      
      const data = await callsApi.getCallsWithFilters(1, filters);
      console.log("Fetched calls data:", data);
      
      if (Array.isArray(data)) {
        setCalls(data);
        
        // Clear error if we successfully got data (even if empty)
        setError(null);
      } else {
        console.warn("Calls data is not an array:", data);
        setCalls([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch calls:", error);
      
      let errorMessage = "Failed to load call logs. Please try again.";
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to the API server.";
      } else if (error.response?.status === 404 || error.message?.includes('404')) {
        errorMessage = "Call logs API endpoint not available.";
      }
      
      setError(errorMessage);
      setCalls([]);
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
      setActiveCalls([]);
    }
  };

  const fetchLiveTranscript = async (callId: number) => {
    try {
      const data = await callsApi.getLiveTranscript(callId.toString());
      if (data) {
        setLiveTranscriptData(data);
      }
    } catch (error) {
      console.error("Failed to fetch live transcript:", error);
      // Don't show error for this - it's normal for completed calls
    }
  };

  const fetchCallStatus = async (callId: number) => {
    try {
      const data = await callsApi.getCallStatus(callId.toString());
      return data;
    } catch (error) {
      console.error("Failed to fetch call status:", error);
      return null;
    }
  };

  const openCallDetails = async (call: Call) => {
    setSelectedCall(call);

    // Only try to fetch additional details if we don't already have transcript
    if (!call.transcript && call.call_id) {
      try {
        const callDetails = await callsApi.getCallById(call.call_id.toString());
        if (callDetails) {
          setSelectedCall({ ...call, ...callDetails });
        } else {
          // If not found (404), just keep the original call data
          // Optionally, show a toast or warning here if desired
        }
      } catch (error: any) {
        // Only log error, do not overwrite selectedCall or show error to user for 404
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch call details:", error);
        }
        // Do not update selectedCall, just continue with what we have
      }
    }

    setShowCallDetails(true);
  };

  const openTranscription = async (call: Call) => {
    setSelectedCall(call);
    
    // Only try to fetch transcript if we don't already have it
    if (!call.transcript && call.call_id) {
      try {
        const transcriptData = await callsApi.getCallTranscript(call.call_id.toString());
        if (transcriptData) {
          setSelectedCall({ ...call, ...transcriptData });
        }
      } catch (error) {
        console.error("Failed to fetch transcript:", error);
        // Don't show error toast for missing transcripts - this is normal
      }
    }
    
    setShowTranscription(true);
  };

  const openLiveTranscript = async (call: Call) => {
    setSelectedCall(call);
    setShowLiveTranscript(true);
    setAutoRefresh(true);
    
    // Fetch initial live transcript data
    await fetchLiveTranscript(call.call_id);
  };

  const closeLiveTranscript = () => {
    setShowLiveTranscript(false);
    setAutoRefresh(false);
    setLiveTranscriptData(null);
    setSelectedCall(null);
  };

  const handleSummarizeCall = async (call: Call) => {
    setSummarizing(true);
    try {
      await callsApi.summarizeCall(call.call_id.toString());
      toast({
        title: "Summary requested",
        description: "The call summary is being generated. Please refresh in a few seconds.",
      });
      // Optionally, refetch call details to show the summary
      const updated = await callsApi.getCallSummary(call.call_id.toString());
      if (updated && selectedCall) {
        setSelectedCall({ ...selectedCall, summary: updated.summary });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary.",
        variant: "destructive",
      });
    } finally {
      setSummarizing(false);
    }
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return "0:00";
    return duration;
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateTime;
    }
  };

  const filteredCalls = Array.isArray(calls) ? calls.filter(call => {
    const matchesSearch = call.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phone_number?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    const matchesOutcome = outcomeFilter === "all" || call.outcome === outcomeFilter;
    
    return matchesSearch && matchesStatus && matchesOutcome;
  }) : [];

  const callStats = {
    total: Array.isArray(calls) ? calls.length : 0,
    completed: Array.isArray(calls) ? calls.filter(c => c.status === "completed").length : 0,
    initiated: Array.isArray(calls) ? calls.filter(c => c.status === "initiated").length : 0,
    failed: Array.isArray(calls) ? calls.filter(c => c.status === "failed").length : 0,
    verified: Array.isArray(calls) ? calls.filter(c => c.caller_verified === true).length : 0
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-blue-100 text-blue-800';
      case 'mixed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const togglePlayback = (callId: string) => {
    if (playingCall === callId) {
      setPlayingCall(null);
    } else {
      setPlayingCall(callId);
    }
  };

  const downloadTranscript = (call: Call) => {
    if (!call.transcript) {
      toast({
        title: "No transcript available",
        description: "This call doesn't have a transcript to download.",
        variant: "destructive",
      });
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([call.transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${call.call_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isActiveCall = (call: Call) => {
    return call.status === 'initiated' || call.status === 'in_progress' || call.status === 'calling';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
          <p className="text-gray-600">Track and analyze all your AI-powered collection calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCalls}>
            <Phone className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" disabled={calls.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {activeCalls.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-700">
                  {activeCalls.length} Active Call{activeCalls.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? 'bg-blue-100 border-blue-300' : ''}
                >
                  <Activity className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-pulse' : ''}`} />
                  Live Updates {autoRefresh ? 'ON' : 'OFF'}
                </Button>
                <Button size="sm" variant="outline" onClick={fetchActiveCalls}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {activeCalls.length > 0 && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeCalls.map((call) => (
                  <div key={call.call_id} className="p-3 bg-white rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{call.contact_name}</p>
                        <p className="text-xs text-gray-600">{call.phone_number}</p>
                        <Badge className="text-xs mt-1 bg-green-100 text-green-800">
                          {call.status}
                        </Badge>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">API Connection Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              onClick={fetchCalls}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && !loading && filteredCalls.length === 0 && calls.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <PhoneOff className="h-5 w-5" />
              <span className="font-medium">No Calls Yet</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              You haven't made any calls yet. Start by creating contacts and initiating calls from the contacts page.
            </p>
          </CardContent>
        </Card>
      )}

      {!error && !loading && calls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-900">{callStats.total}</p>
                </div>
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{callStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Initiated</p>
                  <p className="text-2xl font-bold text-yellow-600">{callStats.initiated}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{callStats.failed}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-purple-600">{callStats.verified}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!error && !loading && calls.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="initiated">Initiated</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="payment_agreed">Payment Agreed</SelectItem>
                  <SelectItem value="payment_made">Payment Made</SelectItem>
                  <SelectItem value="callback_requested">Callback Requested</SelectItem>
                  <SelectItem value="dispute_raised">Dispute Raised</SelectItem>
                  <SelectItem value="no_resolution">No Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Call History</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Showing {filteredCalls.length} of {calls.length} calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading call logs...</span>
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-8">
              <PhoneOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No calls have been made yet</p>
              <p className="text-sm text-gray-400">
                Start by creating contacts and initiating calls from the contacts page
              </p>
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="text-center py-8">
              <PhoneOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No calls match your filters</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCalls.map((call) => (
                <div 
                  key={call.call_id} 
                  className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                    isActiveCall(call) ? 'border-blue-300 bg-blue-50' : ''
                  }`}
                  onClick={() => openCallDetails(call)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActiveCall(call) ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {isActiveCall(call) ? (
                          <PhoneCall className="h-6 w-6 text-blue-600 animate-pulse" />
                        ) : (
                          <PhoneCall className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {call.contact_name || `Contact ${call.call_id}`}
                          </h3>
                          <Badge className={getStatusColor(call.status)}>
                            {call.status.replace('_', ' ')}
                          </Badge>
                          {isActiveCall(call) && (
                            <Badge className="bg-green-100 text-green-800 animate-pulse">
                              LIVE
                            </Badge>
                          )}
                          {call.sentiment && (
                            <Badge className={getSentimentColor(call.sentiment)}>
                              {call.sentiment}
                            </Badge>
                          )}
                          {call.caller_verified && (
                            <Badge className="text-green-600 bg-green-100">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {call.phone_number}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(call.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(call.start_time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            {call.agent_name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 capitalize">
                            {call.call_type} call
                          </span>
                          {call.outcome && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                {call.outcome.replace('_', ' ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isActiveCall(call) && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLiveTranscript(call);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Live Transcript
                        </Button>
                      )}
                      
                      {call.recording_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlayback(call.call_id.toString());
                          }}
                        >
                          {playingCall === call.call_id.toString() ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTranscription(call);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCall && (
        <Dialog open={showLiveTranscript} onOpenChange={closeLiveTranscript}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                Live Transcript - {selectedCall.contact_name}
                <Badge className="bg-red-100 text-red-800 animate-pulse">
                  LIVE
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Real-time conversation monitoring
              </DialogDescription>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600">Real-time conversation monitoring</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Recording in progress</span>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 space-y-4 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(liveTranscriptData?.status || selectedCall.status)}>
                    {liveTranscriptData?.status || selectedCall.status}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">
                    {liveTranscriptData?.duration || formatDuration(selectedCall.duration)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Agent</p>
                  <p className="font-semibold">{selectedCall.agent_name}</p>
                </div>
              </div>

              {liveTranscriptData?.participants && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Participants</h4>
                  <div className="flex gap-4">
                    {liveTranscriptData.participants.map((participant: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {participant.type === 'agent' ? (
                            <Bot className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 bg-white border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Live Conversation
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchLiveTranscript(selectedCall.call_id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </h4>
                </div>
                
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {liveTranscriptData?.transcript ? (
                    <div className="space-y-3">
                      {liveTranscriptData.transcript.split('\n').map((line: string, index: number) => {
                        if (!line.trim()) return null;
                        
                        const isAgent = line.toLowerCase().includes('agent:') || line.toLowerCase().includes('ai:');
                        const isCustomer = line.toLowerCase().includes('customer:') || line.toLowerCase().includes('caller:');
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg max-w-[80%] ${
                              isAgent
                                ? 'bg-blue-100 ml-auto text-right'
                                : isCustomer
                                ? 'bg-gray-100'
                                : 'bg-yellow-50'
                            }`}
                          >
                            <p className="text-sm">{line}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Waiting for conversation to begin...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {liveTranscriptData?.metrics && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sentiment</p>
                    <Badge className={getSentimentColor(liveTranscriptData.metrics.sentiment)}>
                      {liveTranscriptData.metrics.sentiment}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="font-semibold">
                      {Math.round(liveTranscriptData.metrics.confidence * 100)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Words Spoken</p>
                    <p className="font-semibold">{liveTranscriptData.metrics.word_count || 0}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-updating every 2 seconds</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => downloadTranscript(selectedCall)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={closeLiveTranscript}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedCall && (
        <Dialog open={showCallDetails} onOpenChange={setShowCallDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Call Details - {selectedCall.contact_name}
              </DialogTitle>
              <DialogDescription>
                Complete call information and analysis
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedCall.status)}>
                    {selectedCall.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent</p>
                  <p className="font-semibold">{selectedCall.agent_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <div className="flex items-center gap-1">
                    {selectedCall.caller_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {selectedCall.caller_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border rounded-lg">
                <h4 className="font-semibold mb-3">Call Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Call Started</p>
                      <p className="text-sm text-gray-600">{formatDateTime(selectedCall.start_time)}</p>
                    </div>
                  </div>
                  
                  {selectedCall.end_time && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Call Ended</p>
                        <p className="text-sm text-gray-600">{formatDateTime(selectedCall.end_time)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="font-medium">Call Type</p>
                      <p className="text-sm text-gray-600 capitalize">{selectedCall.call_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border rounded-lg">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedCall.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{selectedCall.phone_number}</p>
                  </div>
                </div>
              </div>

              {selectedCall.transcript ? (
                <div className="p-4 bg-white border rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Call Transcript
                  </h4>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-64 overflow-y-auto">
                    {selectedCall.transcript}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border rounded-lg text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No transcript available for this call</p>
                  <p className="text-sm text-gray-400">
                    Transcript will appear here once the call is processed and completed
                  </p>
                </div>
              )}

              {selectedCall.summary && (
                <div className="p-4 bg-green-50 border rounded-lg">
                  <h4 className="font-semibold mb-2">Call Summary</h4>
                  <p className="text-sm text-gray-700">{selectedCall.summary}</p>
                </div>
              )}

              {selectedCall.sentiment && (
                <div className="p-4 bg-purple-50 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sentiment Analysis</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentColor(selectedCall.sentiment)}>
                      {selectedCall.sentiment}
                    </Badge>
                    {selectedCall.confidence_score && (
                      <span className="text-sm text-gray-600">
                        Confidence: {Math.round(selectedCall.confidence_score * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => downloadTranscript(selectedCall)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSummarizeCall(selectedCall)}
                    disabled={summarizing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {summarizing ? "Summarizing..." : "Summarize Call"}
                  </Button>
                </div>
                
                {selectedCall.recording_url && (
                  <Button onClick={() => togglePlayback(selectedCall.call_id.toString())}>
                    {playingCall === selectedCall.call_id.toString() ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Recording
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play Recording
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CallLogs;
