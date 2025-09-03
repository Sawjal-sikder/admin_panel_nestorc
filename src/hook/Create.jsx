import { useState } from "react";
import API from "../services/api";

const useApiMutation = (url, method = "post", config = {}) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [success, setSuccess] = useState(null);

      const createData = async (payload) => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            try {
                  let dataToSend = payload;
                  let headers = { ...config.headers };

                  if (Object.values(payload).some((v) => v instanceof File || v instanceof Blob)) {
                        const formData = new FormData();
                        for (const key in payload) {
                              formData.append(key, payload[key]);
                        }
                        dataToSend = formData;
                        headers["Content-Type"] = "multipart/form-data";
                  } else {
                        headers["Content-Type"] = "application/json";
                  }

                  const response = await API[method](url, dataToSend, { ...config, headers });
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
