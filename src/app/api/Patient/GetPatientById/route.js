import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { error: 'PatientId is required' },
        { status: 400 }
      );
    }

    // Get authentication token
    const token = await authService.getToken();

    // Assuming the external API follows the pattern
    const url = `${BASE_URL}/api/Patient/GetPatientById?PatientId=${patientId}`;
    
    console.log('Fetching patient details from:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'text/plain'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching patient details:', error?.response?.data || error.message);
    
    if (error?.response?.status === 404) {
         return NextResponse.json(
            { error: 'Patient not found' },
            { status: 404 }
          );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch patient details',
        details: error?.response?.data || error.message
      },
      { status: error?.response?.status || 500 }
    );
  }
}
