/**
 * Doctor API Service
 * Handles all doctor-related API calls using Axios
 */

import axiosClient from "@/lib/axiosClient";

/**
 * Fetch all doctors
 * @param {Object} params - Query parameters
 * @param {number} [params.DoctorID] - Doctor ID filter
 * @param {number} [params.ClinicID] - Clinic ID filter
 * @param {string} [params.ClinicName] - Clinic name filter
 * @param {string} [params.MobileNo] - Mobile number filter
 * @param {string} [params.Mode] - Mode parameter
 * @returns {Promise<Array>} List of doctors
 */
/**
 * Search doctors
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of doctors
 */
// Add new doctor
export const addDoctor = async (doctorData) => {
  try {
    const response = await axiosClient.post("/api/doctors/add", doctorData);
    return response.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

// Search doctors
export const searchDoctors = async (params = {}) => {
  try {
    const response = await axiosClient.get("/api/doctors/search", {
      params,
      baseURL: '' // Force relative URL
    });
    return response.data;
  } catch (error) {
    console.error("[Doctor API] Error searching doctors:", error);
    throw error;
  }
};

/**
 * Fetch all doctors
 * @param {Object} params - Query parameters
 * @param {number} [params.DoctorID] - Doctor ID filter
 * @param {number} [params.ClinicID] - Clinic ID filter
 * @param {string} [params.ClinicName] - Clinic name filter
 * @param {string} [params.MobileNo] - Mobile number filter
 * @param {string} [params.Mode] - Mode parameter
 * @returns {Promise<Array>} List of doctors
 */
export const getAllDoctors = async (params = {}) => {
  try {
    return await searchDoctors(params);
  } catch (error) {
    console.error("[Doctor API] Error fetching doctors:", error);
    throw error;
  }
};

/**
 * Add or update a doctor
 * @param {Object} doctorData - Doctor information to upsert
 * @returns {Promise<{doctorID: number, success: boolean}>}
 */
// Helper to transform form data to API payload
// Matches strict curl schema
const transformToApiPayload = (data) => {
  return {
    doctorID: data.doctorID || 0,
    doctorTypeID: 0, // Default as per curl
    clinicID: 0,     // Default as per curl
    regDate: data.regDate || new Date().toISOString(),
    firstName: data.firstName || "string",
    middleName: data.middleName || "string",
    lastName: data.lastName || "string",
    gender: data.gender || "string",
    email: data.email || "string",
    bloodGroup: data.bloodGroup || "string",
    mobile1: data.mobileNo1 || "string",
    mobile2: data.mobileNo2 || "string",
    residential_Address: data.addressLine1 || "string",
    line1: data.addressLine1 || "string",
    line2: data.addressLine2 || "string",
    countryID: 0,
    stateID: 0,
    cityID: 0,
    locationID: 0,
    modifiedDate: new Date().toISOString(),
    modifiedBy: 0,
    isActive: true,
    isDeleted: false, // Should be false for active doctors? Curl says true? Let's use false for 'not deleted' usually. but CURL said true. Wait, isDeleted: true means deleted. Let's send false.
    otp: "string",
    areaPin: data.areaPin || "string",
    userName: data.email || "string",
    password: "Password@123", // Default password?
    dob: data.dateOfBirth || new Date().toISOString(),
    registrationNo: data.registrationNo || "string",
    panCardNo: data.panCardNo || "string",
    panCardImageUrl: "string", // Placeholder if no file uploads yet
    adharCardNo: data.adharCardNo || "string",
    adharCardImageUrl: "string",
    profileImageUrl: "string",
    registrationImageUrl: "string",
    identityPolicyNo: data.indemnityPolicyNo || "string",
    identityPolicyImageUrl: "string",
    roleID: 0,
    createdDate: new Date().toISOString(),
    inTime: data.inTime || "string",
    outTime: data.outTime || "string",
    isExistUser: true,
    isTermAccept: true,
    specialityID: "string",
    basicDegree: "string",
    degreeUpload1: "string",
    degreeUpload2: "string"
  };
};

export const upsertDoctor = async (doctorData) => {
  try {
    // Determine if it's an update based on doctorID
    const isUpdate = doctorData.doctorID && doctorData.doctorID > 0;
    
    // Use the input data directly if it's already transformed, or transform it
    // Ideally, we respect the transformation from the hook. 
    // Re-applying transformation might be redundant but ensures schema compliance.
    const payload = transformToApiPayload(doctorData);
    
    // Ensure doctorID is set correctly in payload
    payload.doctorID = doctorData.doctorID || 0;

    console.log(`[Doctor API] ${isUpdate ? 'Updating' : 'Adding'} Doctor Payload:`, JSON.stringify(payload, null, 2));

    let response;
    if (isUpdate) {
      // Use efficient upsert endpoint (same as add but handles updates internally)
      response = await axiosClient.post(
        "/api/doctors/upsert",
        payload,
        { baseURL: '' }
      );
    } else {
      // Use Add endpoint
      response = await axiosClient.post(
        "/api/doctors/add",
        payload,
        { baseURL: '' }
      );
    }

    const data = response.data;
    
    // Return consistent format
    return { 
      doctorID: typeof data === 'number' ? data : (data?.doctorID || payload.doctorID),
      success: true,
      data: data 
    };

  } catch (error) {
    console.error("[Doctor API] Error upserting doctor:", error);
    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to save doctor";
    throw new Error(errorMessage);
  }
};

/**
 * Delete a doctor
 * @param {number} doctorId - Doctor ID to delete
 * @returns {Promise<boolean>}
 */
export const deleteDoctor = async (doctorId) => {
  try {
    await axiosClient.delete(`/api/Doctor/DeleteDoctor/${doctorId}`);
    return true;
  } catch (error) {
    console.error("[Doctor API] Error deleting doctor:", error);
    throw error;
  }
};

/**
 * Get doctor by ID
 * @param {number} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor details
 */
export const getDoctorById = async (doctorId) => {
  try {
    // Use searchDoctors which hits a known working endpoint
    const doctors = await searchDoctors({ DoctorID: doctorId });
    
    // Return first match or null
    return (doctors && doctors.length > 0) ? doctors[0] : null;
  } catch (error) {
    console.error("[Doctor API] Error fetching doctor:", error);
    throw error;
  }
};
