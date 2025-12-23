/**
 * Accounts API Service
 * Handles all accounts-related API calls using Axios
 */

import axiosClient from "@/lib/axiosClient";

/**
 * Save Cancellation Treatment
 * @param {Object} data - Cancellation data
 * @returns {Promise<Object>} Response data
 */
export const saveCancellationTreatment = async (data) => {
  try {
    const response = await axiosClient.post("/Accounts/SaveCancellationTreatment", data);
    return response.data;
  } catch (error) {
    console.error("[Accounts API] Error saving cancellation treatment:", error);
    throw error;
  }
};
