import axiosClient from '@/lib/axiosClient';

export const getAppointments = async (params = {}) => {
  try {
    const response = await axiosClient.get('/api/Appointments/getAppointments', {
      params,
      baseURL: '' // Force relative path to hit Next.js API route
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const upsertAppointment = async (data) => {
  try {
    const response = await axiosClient.post('/api/Appointments/upsertAppointment', data, {
      baseURL: '' // Force relative path
    });
    return response.data;
  } catch (error) {
    console.error('Error upserting appointment:', error);
    throw error;
  }
};
