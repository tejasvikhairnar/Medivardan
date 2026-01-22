/**
 * Doctor API Service
 * Handles all doctor-related API calls using Axios
 */

import axiosClient from "@/lib/axiosClient";
import { API_CONFIG } from "@/config/api.config";
import { transformFormDataToAPI } from "./transformers";

/**
 * Add new doctor
 * @param {Object} doctorData - Doctor information
 * @returns {Promise<Object>} Response data
 */
export const addDoctor = async (doctorData) => {
  try {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.DOCTOR.ADD, doctorData);
    return response.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

/**
 * Search doctors
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of doctors
 */
export const searchDoctors = async (params = {}) => {
  try {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.DOCTOR.GET_ALL, {
      params,
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
 *
 * BACKEND ISSUE: The POST /Doctor/AddDoctor endpoint returns 500 Internal Server Error.
 * This is a backend bug that needs to be fixed by the backend team.
 *
 * Current workaround: Use PUT /Doctor/UpdateDoctorProfile for updates only.
 * New doctor creation will fail until the backend is fixed.
 *
 * @param {Object} doctorData - Doctor information to upsert
 * @returns {Promise<{doctorID: number, success: boolean}>}
 */
export const upsertDoctor = async (doctorData) => {
  try {
    // Use the shared transformer which handles nulls correctly
    const payload = transformFormDataToAPI(doctorData);
    console.log("Submitting Doctor Payload:", JSON.stringify(payload, null, 2));

    // Remove 'mode' field as the API doesn't expect it
    const { mode, ...cleanPayload } = payload;

    let response;
    const isUpdate = cleanPayload.doctorID && cleanPayload.doctorID > 0;

    if (isUpdate) {
      // UPDATE: Use PUT /Doctor/UpdateDoctorProfile
      console.log("Updating existing doctor (ID:", cleanPayload.doctorID, ")...");
      console.log("Update Payload:", JSON.stringify(cleanPayload, null, 2));

      response = await axiosClient.put(
        API_CONFIG.ENDPOINTS.DOCTOR.UPDATE,
        cleanPayload
      );
    } else {
      // CREATE: Use POST /Doctor/AddDoctor
      // NOTE: This endpoint is currently broken on the backend (returns 500)
      console.log("Creating new doctor...");
      console.log("Add Payload:", JSON.stringify(cleanPayload, null, 2));

      response = await axiosClient.post(
        API_CONFIG.ENDPOINTS.DOCTOR.ADD,
        cleanPayload
      );
    }

    const data = response.data;
    if (typeof data === 'number') {
      return { doctorID: data, success: true };
    }
    return { ...data, success: true };
  } catch (error) {
    console.error("[Doctor API] Error saving doctor:", error);

    // Enhanced error handling with specific messages
    let errorMessage = "Failed to save doctor";

    if (error.response?.status === 500) {
      // Known backend issue with AddDoctor endpoint
      errorMessage = "Backend Server Error: The AddDoctor API endpoint is currently experiencing issues (HTTP 500). Please contact the backend development team to fix the /Doctor/AddDoctor endpoint.";
      console.error("=".repeat(60));
      console.error("BACKEND BUG DETECTED!");
      console.error("Endpoint: POST /Doctor/AddDoctor");
      console.error("Status: 500 Internal Server Error");
      console.error("This is a known issue that requires backend team intervention.");
      console.error("=".repeat(60));
    } else if (error.response?.status === 400) {
      // Validation error
      errorMessage = `Validation Error: ${JSON.stringify(error.response.data)}`;
    } else if (error.response?.data) {
      errorMessage = error.response.data.message ||
                     error.response.data.Message ||
                     error.response.data.error ||
                     (typeof error.response.data === 'string' ? error.response.data : errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
    }

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
    await axiosClient.delete(`${API_CONFIG.ENDPOINTS.DOCTOR.DELETE}/${doctorId}`);
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
    console.log("[getDoctorById] Fetching for ID:", doctorId);
    if (!doctorId) {
        console.error("[getDoctorById] Missing doctorId!");
    }
    
    // Fallback: Use Search API with DoctorID filter
    const response = await axiosClient.get(
      API_CONFIG.ENDPOINTS.DOCTOR.GET_ALL,
      {
        params: { DoctorID: doctorId }
      }
    );

    const data = response.data;
    // Search returns an array, we need the first item
    if (Array.isArray(data) && data.length > 0) {
        return data[0];
    }
    return data;
  } catch (error) {
    console.error("[Doctor API] Error fetching doctor:", error);
    throw error;
  }
};
