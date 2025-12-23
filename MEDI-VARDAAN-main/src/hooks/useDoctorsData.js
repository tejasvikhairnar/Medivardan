import { useQuery } from "@tanstack/react-query";
import { getCommonData } from "@/api/client/common";

export const useDoctorsData = (ClinicId) => {
    return useQuery({
        queryKey: ['doctorsData', ClinicId],
        queryFn: () => getCommonData?.getDoctors(ClinicId),
        // enabled: !!ClinicId,
    })
}

