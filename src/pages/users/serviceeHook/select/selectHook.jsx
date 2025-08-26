import { useEffect, useState } from "react";
import API from "../../../../services/api";

const useFetchData = (endpoint) => {
      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            let isMounted = true;
            setLoading(true);

            API.get(endpoint)
                  .then((res) => {
                        if (isMounted) {
                              setData(res.data);
                              setError(null);
                        }
                  })
                  .catch((err) => {
                        if (isMounted) setError(err);
                  })
                  .finally(() => {
                        if (isMounted) setLoading(false);
                  });

            return () => {
                  isMounted = false;
            };
      }, [endpoint]);

      return { data, loading, error };
};

export default useFetchData;
