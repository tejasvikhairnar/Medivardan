import axiosClient from "@/lib/axiosClient";

export const getParameterTypeData = async (Regions,UserId,Type) => {
    const response = await axiosClient.get(`/api/Dashboard/GetAllGroupedType`,{
        params:{
            Regions,
            UserId,
            Type
        }
    })

    return response.data;
}

