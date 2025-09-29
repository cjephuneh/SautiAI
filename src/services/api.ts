import axios from 'axios';

// Base API configuration
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';
console.log('🔍 API_BASE_URL:', API_BASE_URL);
console.log('🔍 VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Set to true if your backend supports credentials
});

// Helper function to add JSON content type header
const jsonHeaders = {
  'Content-Type': 'application/json',
};

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
        throw new Error(`Cannot connect to server. Please ensure the API server is running at ${API_BASE_URL}`);
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
      const response = await api.get(`/contacts/${contactId}?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in getContact:", error);
      throw error; 
    }
  },
  
  createContact: async (contactData: any) => {
    try {
      const response = await api.post(`/contacts/?user_id=${DEFAULT_USER_ID}`, contactData, {
        headers: jsonHeaders,
      });
      return response.data;
    } catch (error) {
      console.error("API error in createContact:", error);
      throw error;
    }
  },
  
  updateContact: async (contactId: number, contactData: any) => {
    try {
      const response = await api.put(`/contacts/${contactId}?user_id=${DEFAULT_USER_ID}`, contactData, {
        headers: jsonHeaders,
      });
      return response.data;
    } catch (error) {
      console.error("API error in updateContact:", error);
      throw error;
    }
  },
  
  deleteContact: async (contactId: number) => {
    try {
      const response = await api.delete(`/contacts/${contactId}?user_id=${DEFAULT_USER_ID}`);
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
        timeout: 60000, // 60 second timeout for large files
      });
      
      console.log("CSV upload response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API error in uploadContactsCSV:", error);
      
      // Provide more specific error information
      if (error.code === 'ECONNABORTED') {
        throw new Error("Upload timeout. Please try with a smaller file.");
      }
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
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
    try {
      const response = await api.get(`/agents/?user_id=${DEFAULT_USER_ID}`);
      console.log("Raw agents API response:", response.data); // Debug log
      
      // Handle different response structures
      let agentsData = response.data;
      if (Array.isArray(agentsData)) {
        return agentsData;
      } else if (agentsData && Array.isArray(agentsData.agents)) {
        return agentsData.agents;
      } else if (agentsData && Array.isArray(agentsData.data)) {
        return agentsData.data;
      } else {
        console.warn("Unexpected agents response structure:", agentsData);
        return [];
      }
    } catch (error: any) {
      console.error("API error in getAgents:", error);
      
      // If it's a network error or server is down, provide more specific error
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to server. Please ensure the API server is running at ${API_BASE_URL}`);
      }
      
      // If it's a 404, the endpoint might not exist
      if (error.response?.status === 404) {
        throw new Error("Agents API endpoint not found. Please check if the server supports agent management.");
      }
      
      throw error;
    }
  },

  // Returns only agents that are configured and available for calls
  getAvailableAgentsForCalls: async () => {
    const fallbackFromAllAgents = async () => {
      try {
        const agents = await agentsApi.getAgents();
        const normalized = Array.isArray(agents) ? agents : [];
        return normalized.filter((a: any) => (a?.is_active !== false) && !!a?.prompt_template && !!a?.voice_id);
      } catch {
        return [];
      }
    };

    try {
      const response = await api.get(`/agents/available-for-calls?user_id=${DEFAULT_USER_ID}`);
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.available_agents)) return data.available_agents;
      return [];
    } catch (err: any) {
      // Suppress noisy console errors for known 422 routing issue and fallback silently
      if (err?.response?.status === 422) {
        return await fallbackFromAllAgents();
      }
      // Try trailing slash once for servers that differentiate
      try {
        const response = await api.get(`/agents/available-for-calls/?user_id=${DEFAULT_USER_ID}`);
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.available_agents)) return data.available_agents;
        return await fallbackFromAllAgents();
      } catch (e: any) {
        if (e?.response?.status === 422) {
          return await fallbackFromAllAgents();
        }
        // Last resort: warn once, then fallback
        console.warn("getAvailableAgentsForCalls failed, using fallback from /agents", e?.message || e);
        return await fallbackFromAllAgents();
      }
    }
  },
  
  createAgent: async (agentData: any) => {
    try {
      const response = await api.post(`/agents/?user_id=${DEFAULT_USER_ID}`, agentData);
      console.log("Agent created:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("API error in createAgent:", error);
      throw error;
    }
  },
  
  updateAgentSystemMessage: async (agentId: number, promptTemplate: string) => {
    try {
      const response = await api.put(`/agents/${agentId}/system-message?user_id=${DEFAULT_USER_ID}`, { prompt_template: promptTemplate });
      return response.data;
    } catch (error) {
      console.error("API error in updateAgentSystemMessage:", error);
      throw error;
    }
  },
  
  deleteAgent: async (agentId: number) => {
    try {
      const response = await api.delete(`/agents/${agentId}?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      console.error("API error in deleteAgent:", error);
      throw error;
    }
  }
};

// Voices API
export const voicesApi = {
  /**
   * Get all voices (optionally filter by provider).
   * Each voice object includes: voice_id, name, provider, gender, language, sample_url (for preview).
   */
  getVoices: async (provider?: string) => {
    try {
      const url = provider ? `/voices/?provider=${provider}` : '/voices/';
      const response = await api.get(url);
      
      // Handle different response structures
      let voicesData = response.data;
      let voicesArray;
      if (Array.isArray(voicesData)) {
        voicesArray = voicesData;
      } else if (voicesData && Array.isArray(voicesData.voices)) {
        voicesArray = voicesData.voices;
      } else if (voicesData && Array.isArray(voicesData.data)) {
        voicesArray = voicesData.data;
      } else {
        console.warn("Unexpected voices response structure:", voicesData);
        return [];
      }
      
      // Update sample URLs to point to main API server
      return voicesArray.map((voice: any) => ({
        ...voice,
        sample_url: `${API_BASE_URL}/voices/${voice.voice_id}/sample`
      }));
    } catch (error) {
      console.error("API error in getVoices:", error);
      return []; // Return empty array on error
    }
  },
  
  createVoice: async (voiceData: any) => {
    const response = await api.post('/voices/', voiceData);
    return response.data;
  }
};

// Calls API
export const callsApi = {
  // Get all calls for a user
  getCalls: async (userId: number = 1) => {
    try {
      const response = await api.get(`/calls/?user_id=${userId}`);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.calls)) {
        return response.data.calls;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn("Unexpected calls response structure:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("Failed to fetch calls:", error);
      return [];
    }
  },

  // Get calls with filters
  getCallsWithFilters: async (userId: number = 1, filters: { call_type?: string, status?: string } = {}) => {
    try {
      const params = new URLSearchParams({ user_id: userId.toString() });
      
      if (filters.call_type) {
        params.append('call_type', filters.call_type);
      }
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      const response = await api.get(`/calls/?${params}`);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.calls)) {
        return response.data.calls;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn("Unexpected calls response structure:", response.data);
        return [];
      }
    } catch (error: any) {
      console.error("Failed to fetch calls with filters:", error);
      return [];
    }
  },

  // Get specific call by ID
  getCallById: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}`);
      return response.data;
    } catch (error: any) {
      // Only log if not a 404
      if (error.response?.status === 404) {
        // Optionally: console.info(`Call with ID ${callId} not found (404)`);
        return null;
      }
      console.error("Failed to fetch call by ID:", error);
      return null;
    }
  },

  // Create outbound call
  makeOutboundCall: async (contactId: number, agentId: number, userId: number = 1) => {
    try {
      const response = await api.post(`/calls/outbound?user_id=${userId}`, {
        contact_id: contactId,
        agent_id: agentId,
        call_type: 'outbound'
      });
      return response.data;
    } catch (error) {
      console.error("Failed to initiate call:", error);
      throw error;
    }
  },

  // Update call status
  updateCallStatus: async (callId: string, status: string, duration?: number) => {
    try {
      const response = await api.put(`/calls/${callId}/status`, {
        status,
        duration,
        end_time: status === 'completed'
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update call status:", error);
      throw error;
    }
  },

  // Update call transcript
  updateCallTranscript: async (callId: string, transcriptData: {
    transcript: string;
    summary?: string;
    sentiment?: string;
    confidence_score?: number;
    recording_url?: string;
  }) => {
    try {
      const response = await api.put(`/calls/${callId}/transcript`, transcriptData);
      return response.data;
    } catch (error) {
      console.error("Failed to update call transcript:", error);
      throw error;
    }
  },

  // Get call transcript
  getCallTranscript: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}/transcript`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch call transcript:", error);
      // Return null instead of throwing for 404s
      return null;
    }
  },

  // New: Get recording and transcript bundle
  getRecordingAndTranscript: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}/recording`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch recording & transcript:", error);
      return null;
    }
  },

  // New: Download formatted transcript (returns filename and content as text)
  downloadFormattedTranscript: async (callId: string) => {
    try {
      const response = await api.post(`/calls/${callId}/download-transcript`);
      return response.data;
    } catch (error) {
      console.error("Failed to download formatted transcript:", error);
      throw error;
    }
  },

  // New: List calls that have transcripts
  listCallsWithTranscripts: async () => {
    try {
      const response = await api.get(`/calls/with-transcripts`);
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.calls_with_transcripts)) {
        return response.data.calls_with_transcripts;
      }
      return [];
    } catch (error) {
      console.error("Failed to list calls with transcripts:", error);
      return [];
    }
  },

  // Download transcript
  downloadTranscript: async (callId: string, format: 'pdf' | 'txt' = 'pdf') => {
    try {
      const response = await api.post(`/calls/${callId}/transcript/download`, {
        call_id: callId,
        format
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error("Failed to download transcript:", error);
      throw error;
    }
  },

  // Email transcript
  emailTranscript: async (callId: string, email: string, format: 'pdf' | 'txt' = 'pdf') => {
    try {
      const response = await api.post(`/calls/${callId}/transcript/download`, {
        call_id: callId,
        format,
        email
      });
      return response.data;
    } catch (error) {
      console.error("Failed to email transcript:", error);
      throw error;
    }
  },

  // Get live transcript for active calls
  getLiveTranscript: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}/live-transcript`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch live transcript:", error);
      return null;
    }
  },

  // Get real-time call status
  getCallStatus: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}/status`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch call status:", error);
      return null;
    }
  },

  // Summarize a call using Azure OpenAI
  summarizeCall: async (callId: string) => {
    try {
      const response = await api.post(`/calls/${callId}/summarize`);
      return response.data;
    } catch (error) {
      console.error("Failed to summarize call:", error);
      throw error;
    }
  },

  // Get stored summary for a call
  getCallSummary: async (callId: string) => {
    try {
      const response = await api.get(`/calls/${callId}/summary`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch call summary:", error);
      return null;
    }
  }
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (date?: string) => {
    try {
      const params = new URLSearchParams({ user_id: DEFAULT_USER_ID.toString() });
      if (date) {
        params.append('date', date);
      }
      const response = await api.get(`/dashboard/summary?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("API error in getSummary:", error);
      return null;
    }
  },

  getActiveCalls: async () => {
    try {
      const response = await api.get(`/dashboard/active-calls?user_id=${DEFAULT_USER_ID}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("API error in getActiveCalls:", error);
      return [];
    }
  },

  getCallLogs: async () => {
    try {
      const response = await api.get(`/dashboard/call-logs?user_id=${DEFAULT_USER_ID}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("API error in getCallLogs:", error);
      return [];
    }
  },

  getAccountUsage: async (days: number = 7) => {
    try {
      const response = await api.get(`/dashboard/usage?user_id=${DEFAULT_USER_ID}&days=${days}`);
      return response.data;
    } catch (error: any) {
      console.error("API error in getAccountUsage:", error);
      return null;
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
    } catch (error: any) {
      console.error("API error in getCollectionPerformance:", error);
      return null;
    }
  },

  getDebtRecoveryAnalytics: async () => {
    try {
      const response = await api.get(`/analytics/debt-recovery?user_id=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error: any) {
      console.error("API error in getDebtRecoveryAnalytics:", error);
      return null;
    }
  }
};

// Business Inquiries API
export const businessInquiriesApi = {
  createBusinessInquiry: async (inquiryData: {
    date: string;
    time: string;
    full_name: string;
    work_email: string;
    company_name: string;
    phone_number: string;
    challenges: string;
  }) => {
    try {
      const response = await api.post('/business-inquiries/', inquiryData);
      console.log("Business inquiry created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API error in createBusinessInquiry:", error);
      
      // Provide more specific error information
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.detail || "Invalid inquiry data";
        throw new Error(errorMessage);
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to server. Please ensure the API server is running at ${API_BASE_URL}`);
      }
      
      throw error;
    }
  }
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type || 'bearer');
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `${response.data.token_type || 'Bearer'} ${response.data.access_token}`;
      }
      
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API error in login:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to server. Please ensure the API server is running at ${API_BASE_URL}`);
      }
      
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    delete api.defaults.headers.common['Authorization'];
  },
  
  getStoredToken: () => {
    return localStorage.getItem('access_token');
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },
  
  initializeAuth: () => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await api.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Profile data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API error in getProfile:", error);
      
      if (error.response?.status === 401) {
        // Token is invalid, logout user
        authApi.logout();
        throw new Error("Session expired. Please login again.");
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error(`Cannot connect to server. Please ensure the API server is running at ${API_BASE_URL}`);
      }
      
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
  analytics: analyticsApi,
  businessInquiries: businessInquiriesApi,
  auth: authApi
};


