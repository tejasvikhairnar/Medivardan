import { NextResponse } from 'next/server';
import { getMockDoctors } from '@/api/mocks/doctors.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filters object
    const filters = {};
    if (searchParams.get('DoctorID')) filters.DoctorID = searchParams.get('DoctorID');
    if (searchParams.get('ClinicID')) filters.ClinicID = searchParams.get('ClinicID');
    if (searchParams.get('ClinicName')) filters.ClinicName = searchParams.get('ClinicName');
    if (searchParams.get('MobileNo')) filters.MobileNo = searchParams.get('MobileNo');

    const filteredDoctors = getMockDoctors(filters);

    console.log('[Mock API] Returning mock doctor data:', filteredDoctors.length, 'doctors');

    return NextResponse.json(filteredDoctors);
  } catch (error) {
    console.error('[Mock API] Error:', error);
    return NextResponse.json(
      { error: 'Mock API error', message: error.message },
      { status: 500 }
    );
  }
}
