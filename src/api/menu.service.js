import axiosClient from "@/lib/axiosClient";

export const getMenuService = {
    getAllMenu: async (RoleId) => {
        const response = await axiosClient.get("/Menu/Getmenu",{
            params: {
                RoleId
            }
        })
        return response.data;
    },
    
}

