import { useQuery } from "@tanstack/react-query";
import { getMockPricing } from "../api/api";

export const usePricing = () => {
  const {
    data: pricingData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pricingData"],
    queryFn: getMockPricing,
  });

  return { pricingData, isLoading, isError, error, refetch };
};
