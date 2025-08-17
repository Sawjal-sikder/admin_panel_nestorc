import { useQuery } from "@tanstack/react-query";
import { getMockTermsConditions } from "../api/api";

export const useTermsConditions = () => {
  const {
    data: termsConditionsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["termsConditionsData"],
    queryFn: getMockTermsConditions,
  });

  return { termsConditionsData, isLoading, isError, error, refetch };
};
