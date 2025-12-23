import { NextResponse } from 'next/server';
import { getMockLeads } from '@/api/mocks/leads.js';

const API_BASE_URL = "https://bmetrics.in/APIDemo/api";

// JWT Authentication Token (provided by user)
const AUTH_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY2MzQ5MTI5LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.Vgn8u7uXj96rsX3aWFN4jp8wM_7A6OBv_oKlLbXzpGY";

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = true;

// Function to get authentication token
async function getAuthToken() {
  // Return the provided JWT token directly
  return AUTH_TOKEN;
}

export async function GET(request) {
  try {
    console.log('Fetching leads list...');

    // Get authentication token
    const token = await getAuthToken();

    console.log('Using token for leads fetch:', token);

    const response = await fetch(`${API_BASE_URL}/Leads/getLeads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Get leads response status:', response.status);

    // If unauthorized, clear token cache and retry once
    if (response.status === 401) {
      cachedToken = null;
      const newToken = await getAuthToken();

      const retryResponse = await fetch(`${API_BASE_URL}/Leads/getLeads`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });

      const retryResponseText = await retryResponse.text();
      console.log('Retry response:', retryResponseText);

      if (!retryResponse.ok) {
        if (USE_MOCK_FALLBACK) {
          console.log('⚠️  External API failed after retry, using mock data for leads list');
          const mockLeads = getMockLeads();
          return NextResponse.json(mockLeads, {
            headers: {
              'X-Data-Source': 'mock',
              'X-Warning': 'Mock data - external API unavailable'
            }
          });
        }
        return NextResponse.json(
          { error: `HTTP error! status: ${retryResponse.status}`, body: retryResponseText },
          { status: retryResponse.status }
        );
      }

      const retryData = JSON.parse(retryResponseText);
      return NextResponse.json(retryData);
    }

    if (!response.ok) {
      // Handle 404 Not Found or 500 errors with mock fallback
      if ((response.status === 404 || response.status === 500) && USE_MOCK_FALLBACK) {
        console.log('⚠️  External API endpoint not found or failed, using mock data for leads list');
        const mockLeads = getMockLeads();
        return NextResponse.json(mockLeads, {
          headers: {
            'X-Data-Source': 'mock',
            'X-Warning': 'Mock data - external API unavailable'
          }
        });
      }

      const responseText = await response.text();
      console.error('Get leads failed:', responseText);
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}`, body: responseText },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log('Get leads response body:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // If not JSON, return empty array
      data = [];
    }

    console.log('Leads fetch successful, count:', Array.isArray(data) ? data.length : 'N/A');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error);
    console.error('Error stack:', error.stack);

    // Fallback to mock data on any error
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
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
