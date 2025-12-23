/**
 * Doctor Mutations Hook
 * React Query mutations for doctor operations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertDoctor, deleteDoctor } from "@/api/client/doctors";
import { transformFormDataToAPI } from "@/utils/doctorTransformers";

/**
 * Hook for adding/updating doctors
 * @returns {Object} Mutation object with mutate, isLoading, error, etc.
 */
export const useUpsertDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      console.log("[useUpsertDoctor] Submitting data:", apiData);

      // Call API
      const result = await upsertDoctor(apiData);

      return result;
    },
    onSuccess: (data, variables) => {
      console.log("[useUpsertDoctor] Success:", data);

      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: ["doctors"] });

      // Show success message
      const isUpdate = variables.doctorID;
      const message = isUpdate
        ? "Doctor updated successfully!"
        : `Doctor added successfully! Doctor ID: ${data.doctorID}`;

      console.log(message);
    },
    onError: (error) => {
      console.error("[useUpsertDoctor] Error:", error);
    },
  });
};

/**
 * Hook for deleting doctors
 * @returns {Object} Mutation object
 */
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      // Invalidate doctors list
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error) => {
      console.error("[useDeleteDoctor] Error:", error);
    },
  });
};
