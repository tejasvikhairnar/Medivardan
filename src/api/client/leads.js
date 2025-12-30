import axiosClient from "@/lib/axiosClient";

export const getLeads = async (params = {}) => {
    const mergedParams = { PageSize: 20, ...params };
    const response = await axiosClient.get('/api/Leads/getLeads', {
        params: mergedParams,
        baseURL: '' // Force relative path to hit Next.js API route instead of external API
    });

    return response.data;
}

export const upsertLead = async (data) => {
    const response = await axiosClient.post('/api/Leads/upsertLeads', data, {
        baseURL: '' // Force relative path to hit Next.js API route
    });

    return response.data;
}

export const getLeadById = async (id) => {
    // Try both keys in case backend prefers one
    const response = await axiosClient.get('/api/Leads/getLeads', {
        params: { EnquiryID: id, LeadID: id },
        baseURL: ''
    });
    
    // The API might return a list (paginated or filtered).
    // We must find the specific item because even with filtering, backend behavior is unverified.
    if (Array.isArray(response.data)) {
        const found = response.data.find(item => 
            String(item.leadID || item.LeadID) === String(id) || 
            String(item.enquiryID || item.EnquiryID) === String(id)
        );
        // If found specific match, return it. 
        // If not found but list has 1 item and we filtered by ID, maybe that's it? 
        // Safer to return first item IF we are confident, but "works only for recent" suggests we were just picking the first of a full list.
        // So allow fallback to [0] ONLY if the list is small (length 1), otherwise return null implies not found.
        
        if (found) return found;
        if (response.data.length === 1) return response.data[0];
    }
    
    return null;
}
