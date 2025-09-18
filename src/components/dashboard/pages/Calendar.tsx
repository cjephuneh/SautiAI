import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Phone, Users, AlertCircle, CheckCircle, XCircle, Pause, DollarSign, UserX, CalendarDays } from "lucide-react";
import { callsApi, contactsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface CallItem {
  call_id: number;
  contact_name: string;
  agent_name?: string;
  start_time?: string;
  status?: string;
}

interface ContactItem {
  id: number | string;
  name: string;
  phone_number: string;
}

interface ScheduledCall {
  id: string;
  contact_id: number;
  contact_name: string;
  phone_number?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  notes?: string;
  status?: 'scheduled' | 'completed' | 'failed' | 'postponed' | 'payment_pending' | 'unavailable' | 'busy';
  reason?: string; // Reason for status (e.g., "User wasn't available", "Payment due tomorrow", "User is busy")
}

type ViewMode = 'day' | 'week' | 'month';

const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getEndOfWeek = (d: Date) => {
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

// Helper functions for call status
const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
    case 'postponed': return <Pause className="h-4 w-4 text-yellow-600" />;
    case 'payment_pending': return <DollarSign className="h-4 w-4 text-blue-600" />;
    case 'unavailable': return <UserX className="h-4 w-4 text-gray-600" />;
    case 'busy': return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default: return <CalendarDays className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    case 'postponed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'payment_pending': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'unavailable': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'busy': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
    case 'postponed': return 'Postponed';
    case 'payment_pending': return 'Payment Due';
    case 'unavailable': return 'Unavailable';
    case 'busy': return 'Busy';
    default: return 'Scheduled';
  }
};

export const Calendar = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calls, setCalls] = useState<CallItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledCall[]>([]);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>(toISODate(new Date()));
  const [scheduleTime, setScheduleTime] = useState<string>("09:00");
  const [scheduleContactId, setScheduleContactId] = useState<string>("");
  const [scheduleNotes, setScheduleNotes] = useState<string>("");
  const [scheduleStatus, setScheduleStatus] = useState<string>("scheduled");
  const [scheduleReason, setScheduleReason] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Load calls (once)
    callsApi.getCalls().then((data: any[]) => {
      const normalized = Array.isArray(data) ? data : [];
      setCalls(normalized as CallItem[]);
    });
    // Load contacts
    contactsApi.getContacts().then((data: any) => {
      const list = Array.isArray(data) ? data : (data.contacts || []);
      const normalized = list.map((c: any) => ({ id: Number(c.id), name: c.name, phone_number: c.phone_number }));
      setContacts(normalized);
    });
    // Load scheduled from localStorage
    const raw = localStorage.getItem('scheduled_calls');
    if (raw) {
      try { 
        const parsed = JSON.parse(raw);
        setScheduled(parsed);
      } catch {}
    } else {
      // Add sample scheduled calls for demonstration
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);
      
      const sampleScheduled: ScheduledCall[] = [
        {
          id: 'sample_1',
          contact_id: 1,
          contact_name: 'John Doe',
          phone_number: '+1234567890',
          date: toISODate(today),
          time: '10:00',
          status: 'completed',
          reason: 'Call completed successfully',
          notes: 'Payment received'
        },
        {
          id: 'sample_2',
          contact_id: 2,
          contact_name: 'Jane Smith',
          phone_number: '+1234567891',
          date: toISODate(today),
          time: '14:00',
          status: 'unavailable',
          reason: 'User wasn\'t available',
          notes: 'No answer after 3 attempts'
        },
        {
          id: 'sample_3',
          contact_id: 3,
          contact_name: 'Bob Johnson',
          phone_number: '+1234567892',
          date: toISODate(tomorrow),
          time: '09:00',
          status: 'payment_pending',
          reason: 'Payment due tomorrow',
          notes: 'Follow up on payment'
        },
        {
          id: 'sample_4',
          contact_id: 4,
          contact_name: 'Alice Brown',
          phone_number: '+1234567893',
          date: toISODate(tomorrow),
          time: '11:00',
          status: 'busy',
          reason: 'User is busy',
          notes: 'Will call back later'
        },
        {
          id: 'sample_5',
          contact_id: 5,
          contact_name: 'Charlie Wilson',
          phone_number: '+1234567894',
          date: toISODate(dayAfter),
          time: '15:00',
          status: 'scheduled',
          reason: '',
          notes: 'Initial contact attempt'
        }
      ];
      
      setScheduled(sampleScheduled);
      localStorage.setItem('scheduled_calls', JSON.stringify(sampleScheduled));
    }
  }, []);

  const saveScheduled = (items: ScheduledCall[]) => {
    setScheduled(items);
    localStorage.setItem('scheduled_calls', JSON.stringify(items));
  };

  const changeMonth = (delta: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + delta);
    setCurrentDate(d);
  };

  const changeWeek = (delta: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + delta * 7);
    setCurrentDate(d);
  };

  const daysGrid = useMemo(() => {
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const start = getStartOfWeek(first);
    const end = getEndOfWeek(last);
    const days: Date[] = [];
    const day = new Date(start);
    while (day <= end) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const selectedRange = useMemo(() => {
    if (viewMode === 'day') {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (viewMode === 'week') {
      return { start: getStartOfWeek(currentDate), end: getEndOfWeek(currentDate) };
    }
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const start = new Date(first);
    start.setHours(0, 0, 0, 0);
    const end = new Date(last);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, [viewMode, currentDate]);

  const callsInRange = useMemo(() => {
    const { start, end } = selectedRange;
    return calls.filter(c => c.start_time && new Date(c.start_time) >= start && new Date(c.start_time) <= end);
  }, [calls, selectedRange]);

  const scheduledInRange = useMemo(() => {
    const { start, end } = selectedRange;
    return scheduled.filter(s => {
      const dt = new Date(s.date + (s.time ? 'T' + s.time : 'T00:00'));
      return dt >= start && dt <= end;
    });
  }, [scheduled, selectedRange]);

  const summary = useMemo(() => {
    const completed = callsInRange.filter(c => c.status === 'completed').length;
    const failed = callsInRange.filter(c => c.status === 'failed').length;
    const initiated = callsInRange.filter(c => c.status === 'initiated' || c.status === 'calling' || c.status === 'in_progress').length;
    
    // Scheduled calls breakdown by status
    const scheduledCompleted = scheduledInRange.filter(s => s.status === 'completed').length;
    const scheduledFailed = scheduledInRange.filter(s => s.status === 'failed').length;
    const scheduledUnavailable = scheduledInRange.filter(s => s.status === 'unavailable').length;
    const scheduledPaymentDue = scheduledInRange.filter(s => s.status === 'payment_pending').length;
    const scheduledBusy = scheduledInRange.filter(s => s.status === 'busy').length;
    const scheduledPending = scheduledInRange.filter(s => !s.status || s.status === 'scheduled').length;
    
    return {
      scheduled: scheduledInRange.length,
      scheduledCompleted,
      scheduledFailed,
      scheduledUnavailable,
      scheduledPaymentDue,
      scheduledBusy,
      scheduledPending,
      completed,
      failed,
      initiated,
      totalCalls: callsInRange.length
    };
  }, [callsInRange, scheduledInRange]);

  const openScheduleForDate = (dateISO: string) => {
    setScheduleDate(dateISO);
    setScheduleTime("09:00");
    setScheduleContactId(contacts[0]?.id ? String(contacts[0].id) : "");
    setScheduleNotes("");
    setScheduleStatus("scheduled");
    setScheduleReason("");
    setOpenScheduleModal(true);
  };

  const handleCreateSchedule = () => {
    if (!scheduleContactId || !scheduleDate) {
      toast({ title: 'Missing info', description: 'Select a contact and date', variant: 'destructive' });
      return;
    }
    const contact = contacts.find(c => String(c.id) === scheduleContactId);
    if (!contact) return;
    const newItem: ScheduledCall = {
      id: `sched_${Date.now()}`,
      contact_id: Number(contact.id),
      contact_name: contact.name,
      phone_number: contact.phone_number,
      date: scheduleDate,
      time: scheduleTime,
      notes: scheduleNotes,
      status: scheduleStatus as any,
      reason: scheduleReason
    };
    const next = [newItem, ...scheduled];
    saveScheduled(next);
    setOpenScheduleModal(false);
    toast({ title: 'Scheduled', description: `Call scheduled for ${contact.name} on ${scheduleDate} ${scheduleTime}` });
  };

  const handleRemoveSchedule = (id: string) => {
    const next = scheduled.filter(s => s.id !== id);
    saveScheduled(next);
  };

  const handleUpdateSchedule = (id: string, updates: Partial<ScheduledCall>) => {
    const next = scheduled.map(s => s.id === id ? { ...s, ...updates } : s);
    saveScheduled(next);
  };

  const renderMonth = () => (
    <div className="grid grid-cols-7 gap-2">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
        <div key={d} className="text-xs font-medium text-gray-500 text-center">{d}</div>
      ))}
      {daysGrid.map((day) => {
        const inMonth = day.getMonth() === currentDate.getMonth();
        const iso = toISODate(day);
        const daySchedules = scheduled.filter(s => s.date === iso);
        const dayCalls = calls.filter(c => c.start_time && toISODate(new Date(c.start_time)) === iso);
        return (
          <div key={iso} className={`p-2 rounded-lg border ${inMonth ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`} onClick={() => setCurrentDate(day)} onDoubleClick={() => openScheduleForDate(iso)}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${inMonth ? 'text-gray-900' : 'text-gray-400'}`}>{day.getDate()}</span>
              {daySchedules.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {daySchedules.slice(0, 4).map(s => (
                    <div key={s.id} className="flex items-center gap-1 p-1 rounded bg-white shadow-sm border">
                      {getStatusIcon(s.status)}
                    </div>
                  ))}
                  {daySchedules.length > 4 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 py-1 rounded">+{daySchedules.length - 4}</span>
                  )}
                </div>
              )}
            </div>
            {dayCalls.length > 0 && (
              <div className="mt-2 text-[10px] text-gray-600">
                {dayCalls.slice(0, 2).map(c => (
                  <div key={c.call_id} className="truncate">• {c.contact_name}</div>
                ))}
                {dayCalls.length > 2 && <div className="text-gray-400">+{dayCalls.length - 2} more</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const rangeLabel = useMemo(() => {
    if (viewMode === 'day') return currentDate.toLocaleDateString();
    if (viewMode === 'week') {
      const s = getStartOfWeek(currentDate);
      const e = getEndOfWeek(currentDate);
      return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`;
    }
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [viewMode, currentDate]);

  const eventsForSelected = useMemo(() => {
    const { start, end } = selectedRange;
    const dayISO = toISODate(currentDate);
    const sDay = scheduled.filter(s => s.date === dayISO);
    return {
      scheduled: viewMode === 'day' ? sDay : scheduledInRange,
      calls: callsInRange
    };
  }, [viewMode, selectedRange, scheduledInRange, callsInRange, currentDate, scheduled]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">Schedule and review your calls</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewMode('day')} className={viewMode==='day' ? 'border-blue-500' : ''}>Day</Button>
          <Button variant="outline" onClick={() => setViewMode('week')} className={viewMode==='week' ? 'border-blue-500' : ''}>Week</Button>
          <Button variant="outline" onClick={() => setViewMode('month')} className={viewMode==='month' ? 'border-blue-500' : ''}>Month</Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => viewMode==='month' ? changeMonth(-1) : changeWeek(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-semibold">{rangeLabel}</div>
            <Button variant="ghost" onClick={() => viewMode==='month' ? changeMonth(1) : changeWeek(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => { setCurrentDate(new Date()); }}>Today</Button>
            <Button onClick={() => openScheduleForDate(toISODate(currentDate))} className="bg-blue-600 text-white">
              <Phone className="h-4 w-4 mr-2" /> Schedule Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Planner</CardTitle>
            <CardDescription>Double-click a day to schedule a call</CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' && renderMonth()}
            {viewMode !== 'month' && (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">{rangeLabel}</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Scheduled</h4>
                  {eventsForSelected.scheduled.length === 0 ? (
                    <p className="text-sm text-gray-500">No scheduled calls</p>
                  ) : (
                    <div className="space-y-2">
                      {eventsForSelected.scheduled.map(s => (
                        <div key={s.id} className="p-3 border rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{s.contact_name}</div>
                              <Badge className={`text-xs ${getStatusColor(s.status)}`}>
                                {getStatusLabel(s.status)}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleRemoveSchedule(s.id)}>Remove</Button>
                            </div>
                          </div>
                          <div className="flex gap-1 mb-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => handleUpdateSchedule(s.id, { status: 'completed', reason: 'Call completed successfully' })}
                            >
                              ✓ Complete
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => handleUpdateSchedule(s.id, { status: 'unavailable', reason: 'User wasn\'t available' })}
                            >
                              ✗ Unavailable
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => handleUpdateSchedule(s.id, { status: 'payment_pending', reason: 'Payment due tomorrow' })}
                            >
                              $ Payment Due
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => handleUpdateSchedule(s.id, { status: 'busy', reason: 'User is busy' })}
                            >
                              ⚠ Busy
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{s.date}{s.time ? ` ${s.time}` : ''}</div>
                          {s.reason && (
                            <div className="text-xs text-gray-600 mb-1 p-2 bg-gray-50 rounded">
                              <strong>Reason:</strong> {s.reason}
                            </div>
                          )}
                          {s.notes && <div className="text-xs text-gray-600">{s.notes}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold">Calls</h4>
                  {eventsForSelected.calls.length === 0 ? (
                    <p className="text-sm text-gray-500">No calls recorded in this range</p>
                  ) : (
                    <div className="space-y-2">
                      {eventsForSelected.calls.map(c => (
                        <div key={c.call_id} className="p-3 border rounded">
                          <div className="font-medium">{c.contact_name}</div>
                          <div className="text-xs text-gray-500">{c.start_time ? new Date(c.start_time).toLocaleString() : ''}</div>
                          {c.status && <Badge className="mt-1">{c.status}</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Summary
            </CardTitle>
            <CardDescription>
              {viewMode === 'day' ? 'Day' : viewMode === 'week' ? 'Week' : 'Month'} overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Scheduled (total)</span>
                <span className="text-lg font-semibold text-blue-600">{summary.scheduled}</span>
              </div>
              
              {summary.scheduledPending > 0 && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-xs text-gray-600">Pending</span>
                  <span className="text-sm font-semibold text-blue-600">{summary.scheduledPending}</span>
                </div>
              )}
              
              {summary.scheduledCompleted > 0 && (
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-xs text-gray-600">Completed</span>
                  <span className="text-sm font-semibold text-green-600">{summary.scheduledCompleted}</span>
                </div>
              )}
              
              {summary.scheduledUnavailable > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Unavailable</span>
                  <span className="text-sm font-semibold text-gray-600">{summary.scheduledUnavailable}</span>
                </div>
              )}
              
              {summary.scheduledPaymentDue > 0 && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-xs text-gray-600">Payment Due</span>
                  <span className="text-sm font-semibold text-blue-600">{summary.scheduledPaymentDue}</span>
                </div>
              )}
              
              {summary.scheduledBusy > 0 && (
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-xs text-gray-600">Busy</span>
                  <span className="text-sm font-semibold text-orange-600">{summary.scheduledBusy}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Actual Calls</span>
                <span className="text-lg font-semibold text-gray-900">{summary.totalCalls}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-semibold text-green-600">{summary.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">In progress</span>
                <span className="text-lg font-semibold text-yellow-600">{summary.initiated}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Failed</span>
                <span className="text-lg font-semibold text-red-600">{summary.failed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Modal */}
      <Dialog open={openScheduleModal} onOpenChange={setOpenScheduleModal}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
            <DialogDescription>Select a contact and time</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Date</label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Time</label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Contact</label>
              <Select value={scheduleContactId} onValueChange={setScheduleContactId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(c => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name} ({c.phone_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <Select value={scheduleStatus} onValueChange={setScheduleStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="postponed">Postponed</SelectItem>
                  <SelectItem value="payment_pending">Payment Due</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Reason</label>
              <Input 
                value={scheduleReason} 
                onChange={(e) => setScheduleReason(e.target.value)} 
                placeholder="e.g., User wasn't available, Payment due tomorrow, User is busy"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Notes</label>
              <Textarea rows={3} value={scheduleNotes} onChange={(e) => setScheduleNotes(e.target.value)} placeholder="Optional notes" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenScheduleModal(false)}>Cancel</Button>
              <Button onClick={handleCreateSchedule}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;


