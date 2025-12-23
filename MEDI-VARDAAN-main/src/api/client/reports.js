import axiosClient from "@/lib/axiosClient";


export const reportsService = {
    getPatientWiseReport: async (FromDate,ToDate)=>{
        const response =  await axiosClient.get(`/api/Report/GetClinicWiseReport`,{
            params:{
                FromDate,
                ToDate
            }
        })
        return response.data;
    },
    getTreatmentWiseReport: async (FromDate,ToDate)=>{
        const response =  await axiosClient.get(`/api/Report/GetTreatmentWiseReport`,{
            params:{
                FromDate,
                ToDate
            }
        })
        return response.data;
    },
    getDateWiseReport: async (FromDate,ToDate)=>{
        const response =  await axiosClient.get(`/api/Report/GetDateWiseReport`,{
            params:{
                FromDate,
                ToDate
            }
        })
        return response.data;
    },
    getPatientReport: async (FromDate,ToDate)=>{
        const response =  await axiosClient.get(`/api/Report/GetPatientsWiseReport`,{
            params:{
                FromDate,
                ToDate
            }
        })
        return response.data;
    },
}