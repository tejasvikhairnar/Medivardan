import axiosClient from "@/lib/axiosClient";

export const getCommonData = {
    getDoctors: async (ClinicId)=>{
        const response = await axiosClient.get(`/api/Doctor/GetClinicByDoctor`,{
            params:{
                ClinicId
            }
        })
    return response.data;
    },
    getClinics: async ()=>{
        const response = await axiosClient.get(`/api/Clinic/GetClinic`)
    return response.data;
    },

}