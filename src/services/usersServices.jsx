import { useQuery } from "@tanstack/react-query";
import API from "./api";

const getUsers = async (params) => {
  const response = await API.get("/auth/users/", { params });
  return response.data;
};

export const useAllUsers = (params) => {
  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", params],
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  });

  // Direct access to the data array
  const allUsers = response || [];
  const pagination = {
    totalUser: response?.length || 0,
    currentPage: params.page,
    pageSize: params.limit,
  };

  return { allUsers, pagination, isLoading, isError, error, refetch };
};
