import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();

    // Get authentication token
    const token = await authService.getToken();

    const url = `${BASE_URL}/Doctor/AddDoctor`;
    
    console.log('Adding new doctor to:', url);

    console.log('Using token:', token ? 'Token present' : 'No token');

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('External API Response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    const errorData = error?.response?.data;
    console.error('Error adding doctor - Full Details:', JSON.stringify(errorData, null, 2));
    console.error('Request Payload was:', JSON.stringify(body, null, 2));
    
    return NextResponse.json(
      {
        error: 'Failed to add doctor',
        details: errorData || error.message,
        payload: body // Return payload to frontend for inspection
      },
      { status: error?.response?.status || 500 }
    );
  }
}
