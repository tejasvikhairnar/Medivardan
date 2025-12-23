/**
 * Invoice API Service
 * Handles all invoice-related API calls using Axios
 */

import axiosClient from "@/lib/axiosClient";

/**
 * Fetch all invoices with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of invoices
 */
export const getAllInvoices = async (params = {}) => {
  try {
    const response = await axiosClient.get("/Invoice/GetAllInvoices", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("[Invoice API] Error fetching invoices:", error);
    throw error;
  }
};

/**
 * Delete an invoice
 * @param {number} invoiceId
 * @returns {Promise<boolean>}
 */
export const deleteInvoice = async (invoiceId) => {
  try {
    await axiosClient.delete(`/Invoice/DeleteInvoice/${invoiceId}`);
    return true;
  } catch (error) {
    console.error("[Invoice API] Error deleting invoice:", error);
    throw error;
  }
};

/**
 * Fetch cheque details
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export const getChequeDetails = async (params = {}) => {
  try {
    const response = await axiosClient.get("/Invoice/GetChequeDetails", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("[Invoice API] Error fetching cheque details:", error);
    throw error;
  }
};
