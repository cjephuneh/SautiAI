import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:5050', // From the API spec's server URL
});

// Mock user ID for now - in a real app this would come from authentication
const DEFAULT_USER_ID = 1;

// Contacts API
export const contactsApi = {
  getContacts: async () => {
    try {
      const response = await api.get(`/contacts/?user_id=${DEFAULT_USER_ID}`);
      console.log("Raw API response:", response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error("API error in getContacts:", error);
      
      // If it's a network error or server is down, provide more specific error
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error("Cannot connect to server. Please ensure the API server is running on http://localhost:5050");
      }
      
      // If it's a 404, the endpoint might not exist
      if (error.response?.status === 404) {
        throw new Error("API endpoint not found. Please check if the server is running the correct version.");
      }
      
      throw error;
    }
  },
  
  getContact: async (contactId: number) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error("API error in getContact:", error);
      throw error;
    }
  },
  
  createContact: async (contactData: any) => {
    try {
      const response = await api.post(`/contacts/?user_id=${DEFAULT_USER_ID}`, contactData);
      return response.data;
    } catch (error) {
      console.error("API error in createContact:", error);
      throw error;
    }
  },
  
  updateContact: async (contactId: number, contactData: any) => {
    try {
      const response = await api.put(`/contacts/${contactId}`, contactData);
      return response.data;
    } catch (error) {
      console.error("API error in updateContact:", error);
      throw error;
    }
  },
  
  deleteContact: async (contactId: number) => {
    try {
      const response = await api.delete(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error("API error in deleteContact:", error);
      throw error;
    }
  },
  
  uploadContactsCSV: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/contacts/upload-csv?user_id=${DEFAULT_USER_ID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API error in uploadContactsCSV:", error);
      throw error;
    }
  },
  
  initiateCall: async (contactId: number, agentId: number) => {
    try {
      const response = await api.post(`/contacts/${contactId}/call?agent_id=${agentId}&user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in initiateCall:", error);
      throw error;
    }
  }
};

// Agents API
export const agentsApi = {
  getAgents: async () => {
    const response = await api.get(`/agents/?user_id=${DEFAULT_USER_ID}`);
    return response.data;
  },
  
  createAgent: async (agentData: any) => {
    const response = await api.post(`/agents/?user_id=${DEFAULT_USER_ID}`, agentData);
    return response.data;
  },
  
  updateAgentSystemMessage: async (agentId: number, promptTemplate: string) => {
    const response = await api.put(`/agents/${agentId}/system-message`, { prompt_template: promptTemplate });
    return response.data;
  }
};

// Voices API
export const voicesApi = {
  getVoices: async (provider?: string) => {
    const url = provider ? `/voices/?provider=${provider}` : '/voices/';
    const response = await api.get(url);
    return response.data;
  },
  
  createVoice: async (voiceData: any) => {
    const response = await api.post('/voices/', voiceData);
    return response.data;
  }
};

// Calls API
export const callsApi = {
  makeOutboundCall: async (contactId: number, agentId: number) => {
    const response = await api.post(`/calls/outbound?user_id=${DEFAULT_USER_ID}`, {
      contact_id: contactId,
      agent_id: agentId,
      call_type: 'outbound'
    });
    return response.data;
  },
  
  getAllCalls: async (callType?: string, status?: string) => {
    try {
      let url = `/calls/?user_id=${DEFAULT_USER_ID}`;
      const params = [];
      if (callType) params.push(`call_type=${callType}`);
      if (status) params.push(`status=${status}`);
      if (params.length > 0) url += `&${params.join('&')}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("API error in getAllCalls:", error);
      throw error;
    }
  },
  
  getCall: async (callId: number) => {
    try {
      const response = await api.get(`/calls/${callId}`);
      return response.data;
    } catch (error) {
      console.error("API error in getCall:", error);
      throw error;
    }
  },
  
  getCallTranscript: async (callId: number) => {
    try {
      const response = await api.get(`/calls/${callId}/transcript`);
      return response.data;
    } catch (error) {
      console.error("API error in getCallTranscript:", error);
      throw error;
    }
  },
  
  updateCallTranscript: async (callId: number, transcriptData: any) => {
    try {
      const response = await api.put(`/calls/${callId}/transcript`, transcriptData);
      return response.data;
    } catch (error) {
      console.error("API error in updateCallTranscript:", error);
      throw error;
    }
  },
  
  getCallStream: async (callId: number) => {
    const response = await api.get(`/stream/${callId}`);
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (date?: string) => {
    try {
      const url = date 
        ? `/dashboard/summary?user_id=${DEFAULT_USER_ID}&date=${date}`
        : `/dashboard/summary?user_id=${DEFAULT_USER_ID}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("API error in getSummary:", error);
      throw error;
    }
  },

  getActiveCalls: async () => {
    try {
      const response = await api.get(`/dashboard/active-calls?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in getActiveCalls:", error);
      throw error;
    }
  },

  getCallLogs: async () => {
    try {
      const response = await api.get(`/dashboard/call-logs?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in getCallLogs:", error);
      throw error;
    }
  }
};

// Analytics API
export const analyticsApi = {
  getCollectionPerformance: async (startDate?: string, endDate?: string) => {
    try {
      let url = `/analytics/collection-performance?user_id=${DEFAULT_USER_ID}`;
      if (startDate && endDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("API error in getCollectionPerformance:", error);
      throw error;
    }
  },

  getDebtRecoveryAnalytics: async () => {
    try {
      const response = await api.get(`/analytics/debt-recovery?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in getDebtRecoveryAnalytics:", error);
      throw error;
    }
  }
};

export default {
  contacts: contactsApi,
  agents: agentsApi,
  voices: voicesApi,
  calls: callsApi,
  dashboard: dashboardApi,
  analytics: analyticsApi
};
