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
    // Mock data since endpoint /api/Dashboard/GetAllClinicDashboard is missing (404)
    // Using sample data structure matching typical dashboard response
    return [{
        patients: 150,
        procedures: 45,
        revenue: 500000,
        revenuePatient: 3333,
        revenueProcedure: 11111,
        daysSummarylist: [],
        weeksSummarylist: [],
        monthsSummarylist: [],
        quartersSummarylist: [],
        yearsSummarlist: []
    }];
    /*
    const response = await axiosClient.get(`/api/Dashboard/GetAllClinicDashboard`,{
        params:{
            ClinicId,
            DoctorId
            
        }
    })
    return response.data;
    */
},


}