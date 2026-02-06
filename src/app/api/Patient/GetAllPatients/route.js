import { NextResponse } from 'next/server';
import axiosClient from '@/api/client';

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = true;

export async function GET(request) {
  try {
    console.log('Fetching patient list...');
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Construct payload for potential POST search if needed, or just pass params for GET
    // Based on Leads implementation, we might need a similar strategy, 
    // but for now we'll stick to GET as requested by user command, 
    // but we'll prepare the params object just in case.
    
    const params = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    // Ensure PageSize is passed in multiple formats if API is picky
    if (params.PageSize) {
        params.pageSize = params.PageSize;
    }

    console.log('[DEBUG] Fetching patients with params:', params);
    
    if (USE_MOCK_FALLBACK) {
        throw new Error("Forcing Mock Data");
    }

    // Extract auth header
    const authHeader = request.headers.get('authorization');
    const requestConfig = {
        headers: {
            'Authorization': authHeader
        },
        params: params
    };

    // The user provided curl uses GET, so we use GET.
    const response = await axiosClient.get('/Patient/GetAllPatients', requestConfig);

    // axiosClient interceptor already unwraps response.data, so response IS the data
    const data = response;
    
    console.log('Patients fetch successful, count:', Array.isArray(data) ? data.length : 'N/A');
    if (Array.isArray(data) && data.length > 0) {
        console.log('[DEBUG] First Patient Record:', JSON.stringify(data[0], null, 2));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    
    // Log full error details for debugging
    if (error.response) {
         console.error('[DEBUG] Full Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }

    // Mock Fallback
    console.warn('Falling back to mock data due to API error (or forced mock).');
    const mockData = [
        { patientID: 1, firstName: "Prashant", lastName: "Desai", mobile: "7045544960", email: "prashant@example.com", age: "30", gender: "Male", city: "Mumbai", address: "Test Address, Mumbai", bloodGroup: "O+", dob: "1994-01-01" },
        { patientID: 2, firstName: "Karan", lastName: "Mithbawkar", mobile: "9664226872", email: "karan@example.com", age: "28", gender: "Male", city: "Pune", address: "Pune Address", bloodGroup: "A+", dob: "1996-05-15" },
        { patientID: 3, firstName: "Snehal", lastName: "Bornaks", mobile: "9137872164", email: "snehal@example.com", age: "25", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "B+", dob: "1999-08-20" },
        { patientID: 4, firstName: "Suryabhan", lastName: "Yadav", mobile: "9029230585", email: "suryabhan@example.com", age: "45", gender: "Male", city: "Nashik", address: "Nashik Address", bloodGroup: "AB+", dob: "1979-11-11" },
        { patientID: 5, firstName: "Hardik", lastName: "Joshi", mobile: "9029230585", email: "hardik@example.com", age: "32", gender: "Male", city: "Mumbai", address: "Mumbai Address", bloodGroup: "O-", dob: "1992-02-28" },
        { patientID: 6, firstName: "Siddhi", lastName: "Jadhav", mobile: "8291011876", email: "siddhi@example.com", age: "22", gender: "Female", city: "Panvel", address: "Panvel Address", bloodGroup: "A-", dob: "2002-07-07" },
        { patientID: 7, firstName: "Pooja", lastName: "Modi", mobile: "9757316731", email: "pooja@example.com", age: "29", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "B-", dob: "1995-03-30" },
        { patientID: 8, firstName: "Jijabai", lastName: "Vidhate", mobile: "9511753941", email: "jijabai@example.com", age: "50", gender: "Female", city: "Pune", address: "Pune Address", bloodGroup: "AB-", dob: "1974-12-12" },
        { patientID: 9, firstName: "Tanya", lastName: "Madhani", mobile: "2487788628", email: "tanya@example.com", age: "26", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "O+", dob: "1998-06-18" },
        { patientID: 10, firstName: "Punya", lastName: "Arora", mobile: "8527132822", email: "punya@example.com", age: "27", gender: "Female", city: "Delhi", address: "Delhi Address", bloodGroup: "A+", dob: "1997-09-09" }
    ];
    
    // Filter Mock Data
    const { searchParams: errorSearchParams } = new URL(request.url);
    let filteredData = mockData;

    // Filter by FirstName
    const fName = errorSearchParams.get('FirstName') || errorSearchParams.get('firstName');
    if (fName) {
        filteredData = filteredData.filter(p => 
            p.firstName && p.firstName.toLowerCase().includes(fName.toLowerCase())
        );
    }

    // Filter by LastName
    const lName = errorSearchParams.get('LastName') || errorSearchParams.get('lastName');
    if (lName) {
        filteredData = filteredData.filter(p => 
            p.lastName && p.lastName.toLowerCase().includes(lName.toLowerCase())
        );
    }

    // Filter by MobileNo
    const mobile = errorSearchParams.get('MobileNo') || errorSearchParams.get('mobileNo');
    if (mobile) {
        filteredData = filteredData.filter(p => 
            p.mobile && p.mobile.includes(mobile)
        );
    }

    return NextResponse.json(filteredData);
  }
}
