import axiosClient from '@/lib/axiosClient';

/**
 * Upsert consultation data
 * @param {Object} data - The consultation data payload
 * @returns {Promise<Object>} Response data
 */
export const upsertConsultation = async (data) => {
  try {
    const response = await axiosClient.post('/api/Consultation/UpsertConsultation', data, {
      baseURL: '' // Force relative path to hit Next.js API route
    });
    return response.data;
  } catch (error) {
    console.error('Error upserting consultation:', error);
    throw error;
  }
};
