import { useState } from "react";
import API from "../services/api";

const useApiMutation = (url, method = "post") => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(null);

      const createData = async (payload) => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                  const response = await API[method](url, payload);
                  setSuccess(response.data);
                  return response.data;
            } catch (err) {
                  setError(err.response?.data || err.message || "Something went wrong");
                  throw err;
            } finally {
                  setLoading(false);
            }
      };

      return { createData, loading, error, success };
};

export default useApiMutation;
