import { useQuery } from "@tanstack/react-query";
import { getMockPrivacyPolicy } from "../api/api";

export const usePrivacyPolicy = () => {
  const {
    data: privacyPolicyData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["privacyPolicyData"],
    queryFn: getMockPrivacyPolicy,
  });

  return { privacyPolicyData, isLoading, isError, error, refetch };
};
