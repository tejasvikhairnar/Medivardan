import { NextResponse } from 'next/server';
import { getMockLeads } from '@/api/mocks/leads.js';
import axiosClient from '@/lib/axiosClient';

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = true;

// Fallback token for testing/dev when header is missing
// Fallback token removed

export async function GET(request) {
  try {
    console.log('Fetching leads list...');
    console.log('[DEBUG] Request URL:', request.url);

    // Get query parameters from the request
    let searchParams, queryString;
    try {
        const urlObj = new URL(request.url);
        searchParams = urlObj.searchParams;
        queryString = searchParams.toString();
    } catch (e) {
        console.error('[DEBUG] URL parse error:', e.message);
        // Fallback or throw
        throw new Error('Invalid Request URL');
    }
    
    // Construct potential POST payload for search/pagination
    // Construct potential POST payload for search/pagination
    // Construct potential POST payload for search/pagination
    // Minimal payload to match working CURL example
    const searchPayload = {
      PageSize: searchParams.get('PageSize') || 20,
      PageNumber: searchParams.get('PageNumber') || 1,

      // Map common filters
      // Client sends 'name' (New Enquiry), 'visitorName' (Followups), 'mobileNo', 'clinic'
      firstName: searchParams.get('firstName') || searchParams.get('name') || searchParams.get('visitorName'),
      mobile: searchParams.get('mobile') || searchParams.get('mobileNo'),
      
      // Dates - Always ensure a valid date range is sent to prevent backend 500s.
      // If user provided dates, use them. If not, use "All Time" (1900-2100).
      fromDate: searchParams.get('fromDate') || "1900-01-01",
      toDate: searchParams.get('toDate') || "2100-01-01",
      
      // Support legacy keys and ALL potential filters
      Name: searchParams.get('firstName') || searchParams.get('name') || searchParams.get('visitorName'),
      MobileNo: searchParams.get('mobile') || searchParams.get('mobileNo'),
      ClinicID: searchParams.get('clinic') !== "all" && searchParams.get('clinic') ? (searchParams.get('clinic') === "panvel" ? 1 : searchParams.get('clinic') === "pune" ? 2 : searchParams.get('clinic') === "mumbai" ? 3 : 0) : undefined,
      EnquiryID: searchParams.get('EnquiryID') || searchParams.get('enquiryId') || undefined,
      LeadID: searchParams.get('LeadID') || searchParams.get('leadID') || undefined,
    };

    console.log('[DEBUG] Mapped payload:', JSON.stringify(searchPayload));

    // Extract auth header from incoming request to pass to backend
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
        return NextResponse.json(
            { error: 'Unauthorized', details: 'No authorization header provided' },
            { status: 401 }
        );
    }

    const requestConfig = {
        headers: {
            'Authorization': authHeader
        }
    };

    // Strategy: GET only (as per working CURL)
    let response;
    let methodUsed = "GET";

    try {
        console.log(`[PERF] Starting External API Call (${methodUsed})...`);
        
        // Construct query string using the MAPPED searchPayload
        // Clean up parameters: Only send keys that the backend expects (PascalCase)
        const getQueryParams = new URLSearchParams();
        const validBackendKeys = ['PageSize', 'PageNumber', 'Name', 'MobileNo', 'ClinicID', 'EnquiryID', 'LeadID', 'fromDate', 'toDate'];
        
        Object.entries(searchPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && validBackendKeys.includes(key)) {
                getQueryParams.append(key, value);
            }
        });
        const getQueryString = getQueryParams.toString();
        
        // Log the full query for debugging
        console.log(`[DEBUG] Final GET query: ${getQueryString}`);

        console.time("ExternalAPI_Duration");
        response = await axiosClient.get(`/api/Leads/GetAllLeads${getQueryString ? `?${getQueryString}` : ''}`, requestConfig);
        console.timeEnd("ExternalAPI_Duration");
    } catch (error) {
        console.timeEnd("ExternalAPI_Duration");
        console.error(`[DEBUG] GET Error: ${error.message}`);
        
        if (error.response) {
             console.error(`[DEBUG] GET Error Status: ${error.response.status}`);
             console.error(`[DEBUG] GET Error Data:`, JSON.stringify(error.response.data));
             
             // Return the ACTUAL upstream error code (e.g. 400) instead of 500
             return NextResponse.json(
                 { error: 'External API Error', details: error.response.data }, 
                 { status: error.response.status }
             );
        }
        throw error; // Throw internal errors to be caught effectively by outer block
    }

    console.log(`[DEBUG] ${methodUsed} Response Status:`, response.status);
    
    const data = response.data;

    console.log('Leads fetch successful, count:', Array.isArray(data) ? data.length : 'N/A');
    if (Array.isArray(data) && data.length > 0) {
        // Log FULL first item to debug schema mismatch
        console.log('[DEBUG] Full First Item:', JSON.stringify(data[0], null, 2));

        // Sort by Date (Newest First)
        data.sort((a, b) => {
            const dateA = new Date(a.leadDate || a.LeadDate || 0);
            const dateB = new Date(b.leadDate || b.LeadDate || 0);
            return dateB - dateA;
        });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    
    // Log full error details for debugging
    if (error.response) {
         console.error('[DEBUG] Full Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }

    // Fallback to mock data if enabled (currently false)
    if (USE_MOCK_FALLBACK) {
      console.log('⚠️  Exception occurred, using mock data for leads list');
      const mockLeads = getMockLeads();
      return NextResponse.json(mockLeads, {
        headers: {
          'X-Data-Source': 'mock',
          'X-Warning': 'Mock data - external API unavailable'
        }
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch leads',
        details: error.response ? error.response.data : error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
