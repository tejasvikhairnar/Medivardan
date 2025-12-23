import { NextResponse } from 'next/server';
import { addMockDoctor, updateMockDoctor } from '@/api/mocks/doctors.js';

const API_BASE_URL = "https://bmetrics.in/APIDemo/api";

// JWT Authentication Token (provided by user)
const AUTH_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY2MzQ5MTI5LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.Vgn8u7uXj96rsX3aWFN4jp8wM_7A6OBv_oKlLbXzpGY";

// Flag to enable/disable mock data fallback for UpsertDoctor endpoint
// Set to false to always try real API first
const USE_MOCK_FALLBACK = false;

// Flag to sync data to mock storage even when real API works
// This ensures doctors appear in the list (since GetAllDoctors is broken)
const SYNC_TO_MOCK_STORAGE = true;

// Function to get authentication token
async function getAuthToken() {
  // Return the provided JWT token directly
  return AUTH_TOKEN;
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Upserting doctor with data:', JSON.stringify(body, null, 2));

    // Get authentication token
    const token = await getAuthToken();

    console.log('Using token for upsert:', token);

    const response = await fetch(`${API_BASE_URL}/DoctorRegistration/UpsertDoctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    console.log('Upsert response status:', response.status);

    // Get response body for debugging
    const responseText = await response.text();
    console.log('Upsert response body:', responseText);

    // If unauthorized, clear token cache and retry once
    if (response.status === 401) {
      cachedToken = null;
      const newToken = await getAuthToken();

      const retryResponse = await fetch(`${API_BASE_URL}/DoctorRegistration/UpsertDoctor`, {
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
      // Handle 500 errors with mock fallback
      if (response.status === 500 && USE_MOCK_FALLBACK) {
        console.log('⚠️  External API failed, using mock upsert');

        // Add or update doctor in mock storage
        let savedDoctor;
        if (body.doctorID && body.doctorID !== null) {
          // Update existing doctor
          savedDoctor = updateMockDoctor(body.doctorID, body);
        } else {
          // Add new doctor
          savedDoctor = addMockDoctor(body);
        }

        const mockResponse = {
          success: true,
          doctorID: savedDoctor.doctorID,
          message: 'Doctor saved successfully (MOCK DATA - not saved to real database)',
          data: savedDoctor
        };

        console.log('Mock upsert response:', mockResponse);

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
      // Response might be just a number (doctor ID)
      data = { doctorID: parseInt(responseText), success: true };
    }

    // If data is just a number, wrap it in an object
    if (typeof data === 'number') {
      data = { doctorID: data, success: true };
    }

    console.log('Upsert successful, doctor ID:', data.doctorID || data);

    // Also save to mock storage so it appears in the list
    // (since GetAllDoctors endpoint is broken)
    if (SYNC_TO_MOCK_STORAGE) {
      try {
        const doctorWithId = {
          ...body,
          doctorID: data.doctorID || data,
        };

        if (body.doctorID && body.doctorID !== null) {
          updateMockDoctor(body.doctorID, doctorWithId);
          console.log('✅ Synced update to mock storage');
        } else {
          addMockDoctor(doctorWithId);
          console.log('✅ Synced new doctor to mock storage');
        }
      } catch (syncError) {
        console.error('Failed to sync to mock storage:', syncError);
        // Don't fail the whole request if sync fails
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error upserting doctor:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upsert doctor',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
