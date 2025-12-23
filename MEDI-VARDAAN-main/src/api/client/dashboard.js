import axiosClient from "@/lib/axiosClient";

export const getDashboardData = async (Regions,Id) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllGrouped`,{
        params:{
            Regions,
            Id
        }
    })

return response.data;
};