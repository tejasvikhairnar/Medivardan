import { useQuery } from "@tanstack/react-query";
import { getMenuService } from "@/api/client/menu";


export const useMenuData = (RoleId) => {
    return useQuery({
        queryKey: ['menuData', RoleId],
// queryFn: () => getMenuService.getAllMenu(RoleId),
        queryFn: async () => [],
        enabled: !!RoleId,
    })
}