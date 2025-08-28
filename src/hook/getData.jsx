import { useEffect, useState } from "react";
import API from "../services/api";

const useFetch = (url, options = {}) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            let isMounted = true;

            const fetchData = async () => {
                  try {
                        const response = await API.get(url, options);
                        if (isMounted) {
                              setData(response.data);
                        }
                  } catch (err) {
                        if (isMounted) {
                              setError(err.message || "Something went wrong");
                        }
                  } finally {
                        if (isMounted) setLoading(false);
                  }
            };

            fetchData();

            return () => {
                  isMounted = false; // cleanup to avoid memory leaks
            };
      }, [url]);

      return { data, loading, error };
};

export default useFetch;
