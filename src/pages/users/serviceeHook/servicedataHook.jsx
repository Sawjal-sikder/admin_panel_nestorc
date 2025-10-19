import { useEffect, useState, useCallback } from "react";
import API from "../../../services/api";

const useServiceData = () => {
      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchData = useCallback(async () => {
            setLoading(true);
            try {
                  const response = await API.get("/services/venues/admin/");
                  setData(response.data);
            } catch (err) {
                  setError(err);
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            fetchData();
      }, [fetchData]);

      return { data, loading, error, refresh: fetchData };
};

export default useServiceData;
