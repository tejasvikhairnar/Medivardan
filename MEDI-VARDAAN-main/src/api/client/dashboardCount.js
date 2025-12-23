import axiosClient from "@/lib/axiosClient";

export const dashboardCount={
getDashboardCountData : async (Regions,UserId,Type) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllDashboard`,{
        params:{
            Regions,
            UserId,
            Type
        }
    })

return response.data;
},


getClinicDashboardCountData : async (ClinicId,DoctorId) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllClinicDashboard`,{
        params:{
            ClinicId,
            DoctorId
            
        }
    })
return response.data;
},


}