import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";


export const useLogin=()=>{
    return useMutation({
        mutationFn:async(payload)=>{
            const {data} = await axiosClient.post("/api/Auth/Login",payload);
            return data;
        }
        
    })
}