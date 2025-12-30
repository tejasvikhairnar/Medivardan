import { NextResponse } from 'next/server';
import axiosClient from '@/lib/axiosClient';

// Fallback token from User's CURL
const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Upserting appointment with data:', JSON.stringify(body, null, 2));

    // Force Auth Token as per previous success
    let authHeader = `Bearer ${FALLBACK_TOKEN}`;

    const payload = body;

    const apiUrl = 'https://bmetrics.in/APIDemo/api/Appointment/UpsertAppointment';
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    console.log('Upsert response status:', response.status);
    
    // Attempt to parse response
    const text = await response.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        // If not JSON, it might be a plain text ID or success message
        data = { message: text, success: response.ok };
    }

    if (!response.ok) {
        console.error('External API Error:', response.status, text);
        return NextResponse.json(
            { error: `External API Error: ${response.status}`, details: data },
            { status: response.status }
        );
    }
    
    console.log('Appointment upsert successful, data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error upserting appointment:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upsert appointment',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
