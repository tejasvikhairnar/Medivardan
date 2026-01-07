import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';
import axios from 'axios';
import { addMockDoctor, updateMockDoctor } from '@/api/mocks/doctors.js';

const USE_MOCK_FALLBACK = true; // Re-enabled as backend is 500

const { BASE_URL } = API_CONFIG;

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();

    console.log('--- Incoming Request Body ---');
    console.log(JSON.stringify(body, null, 2));

    // Get authentication token
    let token;
    try {
      token = await authService.getToken();
      console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token');
    } catch (authError) {
      console.error('Authentication service failed:', authError);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 500 }
      );
    }

    const url = `${BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR.ADD}`;
    console.log('Upserting doctor to:', url);

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('External API Response Status:', response.status);
    console.log('External API Response Data:', JSON.stringify(response.data, null, 2));
    
    return NextResponse.json(response.data);
  } catch (error) {
    const errorData = error?.response?.data;
    const errorStatus = error?.response?.status || 500;
    
    console.error('--- API Request Failed ---');
    console.error('Error Status:', errorStatus);
    console.error('Error Message:', error.message);
    if (errorData) {
      console.error('Upstream Error Data:', JSON.stringify(errorData, null, 2));
    } else if (error.request) {
        console.error('No response received from upstream server.');
    } else {
        console.error('Error setting up request:', error.message);
    }

    // MOCK DATA FALLBACK
    if (errorStatus === 500 && USE_MOCK_FALLBACK) {
        console.log('⚠️  External API failed (500), using mock upsert fallback');

        // Add or update doctor in mock storage
        let savedDoctor;
        // Check if doctorID is present and non-zero
        if (body.doctorID && body.doctorID !== 0 && body.doctorID !== "0") {
          savedDoctor = updateMockDoctor(body.doctorID, body);
        } else {
          savedDoctor = addMockDoctor(body);
        }

        const mockResponse = {
          success: true,
          doctorID: savedDoctor.doctorID,
          message: 'Doctor saved successfully (MOCK DATA - fallback active)',
          data: savedDoctor
        };

        return NextResponse.json(mockResponse, {
          status: 200,
          headers: {
            'X-Data-Source': 'mock',
            'X-Fallback': 'true'
          }
        });
    }
    
    return NextResponse.json(
      {
        error: 'Failed to add/update doctor',
        details: errorData || error.message,
        payload: body,
        upstreamStatus: errorStatus,
        upstreamUrl: url
      },
      { status: errorStatus }
    );
  }
}
