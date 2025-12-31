import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('DoctorID');

    if (!doctorId) {
      return NextResponse.json(
        { error: 'DoctorID is required' },
        { status: 400 }
      );
    }

    // Get authentication token
    const token = await authService.getToken();

    const url = `${BASE_URL}/Doctor/GetDoctorById?DoctorID=${doctorId}`;
    
    console.log('Fetching doctor details from:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'text/plain'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching doctor details:', error?.response?.data || error.message);
    
    // Handle 404 specifically
    if (error?.response?.status === 404) {
         return NextResponse.json(
            { error: 'Doctor not found' },
            { status: 404 }
          );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch doctor details',
        details: error?.response?.data || error.message
      },
      { status: error?.response?.status || 500 }
    );
  }
}
