/**
 * Leads API Client
 * Uses native fetch for local Next.js API routes
 */

export const getLeads = async (params = {}) => {
    const mergedParams = { PageSize: 20, ...params };

    // Build query string
    const queryString = new URLSearchParams(
        Object.entries(mergedParams).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();

    const url = `/api/Leads/getLeads${queryString ? `?${queryString}` : ''}`;

    // Get token from localStorage for auth header
    let authHeader = '';
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) {
            authHeader = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader })
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const upsertLead = async (data) => {
    // Get token from localStorage for auth header
    let authHeader = '';
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) {
            authHeader = `Bearer ${token}`;
        }
    }

    const response = await fetch('/api/Leads/upsertLeads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader })
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export const getLeadById = async (id) => {
    const data = await getLeads({ EnquiryID: id, LeadID: id });

    // The API might return a list (paginated or filtered).
    // We must find the specific item because even with filtering, backend behavior is unverified.
    if (Array.isArray(data)) {
        const found = data.find(item =>
            String(item.leadID || item.LeadID) === String(id) ||
            String(item.enquiryID || item.EnquiryID) === String(id)
        );

        if (found) return found;
        if (data.length === 1) return data[0];
    }

    return null;
}
