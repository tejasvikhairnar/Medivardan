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
export const upsertDoctor = async (doctorData) => {
  try {
    const response = await axiosClient.post(
      "/api/doctors/add",
      doctorData,
      { baseURL: '' } // Force relative URL to hit Next.js API route
    );

    // Handle different response formats
    // API might return just a number (doctorID) or an object
    const data = response.data;

    if (typeof data === 'number') {
      return { doctorID: data, success: true };
    }

    return { ...data, success: true };
  } catch (error) {
    console.error("[Doctor API] Error upserting doctor:", error);

    // Extract error message
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
    const response = await axiosClient.get(
      `/api/doctors/get-by-id`,
      {
        params: { DoctorID: doctorId },
        baseURL: '' // Force relative URL
      }
    );

    return response.data;
  } catch (error) {
    console.error("[Doctor API] Error fetching doctor:", error);
    throw error;
  }
};
