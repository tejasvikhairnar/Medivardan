import { NextResponse } from 'next/server';
import { addMockLead, updateMockLead } from '@/api/mocks/leads.js';

const API_BASE_URL = "https://bmetrics.in/APIDemo/api";

// JWT Authentication Token (provided by user)
const AUTH_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY2MzQ5MTI5LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.Vgn8u7uXj96rsX3aWFN4jp8wM_7A6OBv_oKlLbXzpGY";

// Flag to enable/disable mock data fallback for UpsertLeads endpoint
// Set to false to always try real API first
const USE_MOCK_FALLBACK = false;

// Flag to sync data to mock storage even when real API works
const SYNC_TO_MOCK_STORAGE = true;

// Function to get authentication token
async function getAuthToken() {
  // Return the provided JWT token directly
  return AUTH_TOKEN;
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Upserting lead with data:', JSON.stringify(body, null, 2));

    // Get authentication token
    const token = await getAuthToken();

    console.log('Using token for lead upsert:', token);

    const response = await fetch(`${API_BASE_URL}/Leads/upsertLeads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    console.log('Upsert lead response status:', response.status);

    // Get response body for debugging
    const responseText = await response.text();
    console.log('Upsert lead response body:', responseText);

    // If unauthorized, clear token cache and retry once
    if (response.status === 401) {
      cachedToken = null;
      const newToken = await getAuthToken();

      const retryResponse = await fetch(`${API_BASE_URL}/Leads/upsertLeads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
        body: JSON.stringify(body),
      });

      const retryResponseText = await retryResponse.text();
      console.log('Retry response:', retryResponseText);

      if (!retryResponse.ok) {
        return NextResponse.json(
          { error: `HTTP error! status: ${retryResponse.status}`, body: retryResponseText },
          { status: retryResponse.status }
        );
      }

      const retryData = JSON.parse(retryResponseText);
      return NextResponse.json(retryData);
    }

    if (!response.ok) {
      // Handle 400 Bad Request with detailed error message
      if (response.status === 400) {
        console.error('❌ Bad Request (400) - API rejected the data format');
        console.error('Request body sent:', JSON.stringify(body, null, 2));
        console.error('Response:', responseText);

        return NextResponse.json(
          {
            error: `Bad Request: The API rejected the data format. ${responseText}`,
            requestBody: body,
            responseBody: responseText
          },
          { status: 400 }
        );
      }

      // Handle 500 errors with mock fallback
      if (response.status === 500 && USE_MOCK_FALLBACK) {
        console.log('⚠️  External API failed, using mock upsert for lead');

        // Add or update lead in mock storage
        let savedLead;
        if (body.leadID && body.leadID !== null) {
          // Update existing lead
          savedLead = updateMockLead(body.leadID, body);
        } else {
          // Add new lead
          savedLead = addMockLead(body);
        }

        const mockResponse = {
          success: true,
          leadID: savedLead.leadID,
          message: 'Lead saved successfully (MOCK DATA - not saved to real database)',
          data: savedLead
        };

        console.log('Mock lead upsert response:', mockResponse);

        return NextResponse.json(mockResponse, {
          status: 200,
          headers: {
            'X-Data-Source': 'mock',
            'X-Warning': 'Mock upsert - data not saved to external API'
          }
        });
      }

      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}`, body: responseText },
        { status: response.status }
      );
    }

    // Try to parse as JSON, if it's just a number, wrap it
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Response might be just a number (lead ID)
      data = { leadID: parseInt(responseText), success: true };
    }

    // If data is just a number, wrap it in an object
    if (typeof data === 'number') {
      data = { leadID: data, success: true };
    }

    console.log('Lead upsert successful, lead ID:', data.leadID || data);

    // Also save to mock storage so it appears in the list
    if (SYNC_TO_MOCK_STORAGE) {
      try {
        const leadWithId = {
          ...body,
          leadID: data.leadID || data,
        };

        if (body.leadID && body.leadID !== null) {
          updateMockLead(body.leadID, leadWithId);
          console.log('✅ Synced lead update to mock storage');
        } else {
          addMockLead(leadWithId);
          console.log('✅ Synced new lead to mock storage');
        }
      } catch (syncError) {
        console.error('Failed to sync lead to mock storage:', syncError);
        // Don't fail the whole request if sync fails
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error upserting lead:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upsert lead',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
