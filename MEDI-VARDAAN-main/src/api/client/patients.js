import axiosClient from "@/lib/axiosClient";

export const patientService = {
  // Get patient by ID
  getPatientById: async (patientId) => {
    const response = await axiosClient.get(`/api/Patient/GetPatientById`, {
      params: {
        patientId,
      },
    });
    return response.data;
  },

  // Update patient details
  updatePatient: async (patientData) => {
    const response = await axiosClient.put(`/api/Patient/UpdatePatient`, patientData);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData) => {
    const response = await axiosClient.post(`/api/Patient/CreatePatient`, patientData);
    return response.data;
  },

  // Search patients
  searchPatients: async (searchParams) => {
    const response = await axiosClient.get(`/api/Patient/SearchPatients`, {
      params: searchParams,
    });
    return response.data;
  },

  // Upload patient profile image
  uploadPatientImage: async (patientId, imageFile) => {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("image", imageFile);

    const response = await axiosClient.post(`/api/Patient/UploadImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
