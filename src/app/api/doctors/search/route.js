import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    // Get authentication token
    const token = await authService.getToken();

    const url = `${BASE_URL}/Doctor/search?${params.toString()}`;
    
    console.log('Searching doctors at:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('EXTERNAL API ERROR:', error.response.status, error.response.data);
      return NextResponse.json(
        { error: 'External API Error', details: error.response.data },
        { status: error.response.status }
      );
    }
    console.error('INTERNAL SERVER ERROR:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
