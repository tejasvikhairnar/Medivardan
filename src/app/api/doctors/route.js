import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api.config';
import { authService } from '@/services/authService';

const { BASE_URL, ENDPOINTS, FEATURES } = API_CONFIG;

const USE_MOCK_FALLBACK = true; // Enabled since API is 500


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get authentication token
    const token = await authService.getToken();

    // Build query string from search params
    const params = new URLSearchParams();
    if (searchParams.get('DoctorID')) params.append('DoctorID', searchParams.get('DoctorID'));
    if (searchParams.get('ClinicID')) params.append('ClinicID', searchParams.get('ClinicID'));
    if (searchParams.get('ClinicName')) params.append('ClinicName', searchParams.get('ClinicName'));
    if (searchParams.get('MobileNo')) params.append('MobileNo', searchParams.get('MobileNo'));
    if (searchParams.get('Mode')) params.append('Mode', searchParams.get('Mode'));

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_URL}${ENDPOINTS.DOCTOR.GET_ALL}?${queryString}`
      : `${BASE_URL}${ENDPOINTS.DOCTOR.GET_ALL}`;

    console.log('Fetching doctors from:', url);
    console.log('Using token:', token);
    console.log('Full URL breakdown:', {
      base: API_BASE_URL,
      path: '/DoctorRegistration/GetAllDoctors',
      query: queryString || 'none'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Log response body for debugging
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
    console.log('Response body length:', responseText.length);

    // If unauthorized, clear token cache and retry once
    if (response.status === 401) {
      console.log('Received 401, clearing token cache and retrying...');
      cachedToken = null;
      const newToken = await getAuthToken();

      const retryResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });

      const retryText = await retryResponse.text();

      if (!retryResponse.ok) {
        console.error('Retry also failed:', retryText);
        return NextResponse.json(
          { error: `HTTP error! status: ${retryResponse.status}`, body: retryText },
          { status: retryResponse.status }
        );
      }

      const retryData = JSON.parse(retryText);
      return NextResponse.json(retryData);
    }

    // Handle 404 with "No doctors found" as a successful empty result
    if (response.status === 404 && responseText.includes('No doctors found')) {
      console.log('No doctors found in database, returning empty array');
      return NextResponse.json([]);
    }

    // Handle 500 errors from external API
    if (response.status === 500) {
      console.error('External API returned 500 error:', responseText);

      // If mock fallback is enabled, use mock data
      if (USE_MOCK_FALLBACK) {
        console.log('⚠️  Falling back to mock data due to external API error');

        // Redirect to mock endpoint
        const mockUrl = new URL('/api/doctors/mock', request.url);
        // Copy search params to mock endpoint
        searchParams.forEach((value, key) => {
          mockUrl.searchParams.append(key, value);
        });

        const mockResponse = await fetch(mockUrl);
        const mockData = await mockResponse.json();

        return NextResponse.json(mockData, {
          headers: {
            'X-Data-Source': 'mock',
            'X-Warning': 'Using mock data - external API unavailable'
          }
        });
      }

      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.Message) {
          console.error('API Error Message:', errorData.Message);
          return NextResponse.json(
            {
              error: 'External API error',
              message: errorData.Message || 'The backend API encountered an error',
              apiResponse: errorData
            },
            { status: 500 }
          );
        }
      } catch (parseError) {
        // If parsing fails, return generic error
        console.error('Could not parse error response');
      }

      return NextResponse.json(
        {
          error: 'Backend API error',
          message: 'The external API is currently experiencing issues. Please contact the API administrator.',
          body: responseText
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Non-OK response:', response.status, responseText);
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}`, body: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Successfully parsed response data');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to fetch doctors',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
