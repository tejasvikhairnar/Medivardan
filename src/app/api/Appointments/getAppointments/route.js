import { NextResponse } from 'next/server';

// Fallback token from User's CURL
const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const mode = searchParams.get('Mode') || searchParams.get('mode');
    const doctorID = searchParams.get('DoctorID') || searchParams.get('doctorID');

    // Construct query string for backend
    const backendParams = new URLSearchParams();
    if (mode) backendParams.append('Mode', mode);
    if (doctorID && doctorID !== 'all' && doctorID !== '0') backendParams.append('DoctorID', doctorID);

    // Force Auth Token
    const authHeader = `Bearer ${FALLBACK_TOKEN}`;

    const apiUrl = `https://bmetrics.in/APIDemo/api/Appointment/GetAppointments?${backendParams.toString()}`;
    
    console.log('[DEBUG] Fetching appointments from:', apiUrl);

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'accept': '*/*',
        }
    });

    console.log(`[DEBUG] Appointments API response status: ${response.status}`);
    
    // Attempt to parse response
    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        data = { message: text, success: response.ok };
    }

    if (!response.ok) {
        console.error('External API Error:', response.status, text);
        return NextResponse.json(
            { error: `External API Error: ${response.status}`, details: data },
            { status: response.status }
        );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error.message },
      { status: 500 }
    );
  }
}
