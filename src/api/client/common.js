import axiosClient from "@/lib/axiosClient";

export const getCommonData = {
    getDoctors: async (ClinicId)=>{
        const response = await axiosClient.get(`/api/Doctor/search`,{
            params:{
                ClinicID: ClinicId
            }
        })
    return response.data;
    },
    getClinics: async ()=>{
        // Mock data since endpoint /api/Clinic/GetClinic is missing
        return [
            { clinicId: "1", clinicName: "Main Clinic" },
            { clinicId: "2", clinicName: "East Wing" }
        ];
        // const response = await axiosClient.get(`/api/Clinic/GetClinic`)
        // return response.data;
    },

}