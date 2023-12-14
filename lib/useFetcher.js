import { useCallback, useEffect, useRef, useState } from "react";
import sdkFetcher, { config } from "./fetcher";

const cache = {};

export default (action, method, path, input, body) => {
  const [response, setResponse] = useState({ data: undefined, error: undefined, loading: false });
  const timeoutRef = useRef({});

  const fetch = useCallback(
    async (prevData) => {
      try {
        !prevData && setResponse((prev) => ({ ...prev, loading: true }));
        const res = await sdkFetcher(action, method, path, input, body, true);
        if (!prevData || (cache[path] && cache[path] !== prevData)) {
          cache[path] = res;
          console.log({ res });
          setResponse({ data: JSON.parse(res), error: undefined, loading: false });
        }
        timeoutRef.current = setTimeout(() => fetch(res), config.interval);
        console.log(timeoutRef.current);
      } catch (error) {
        setResponse({ data: undefined, error, loading: false });
      }
    },
    [config.interval, config.onSuccess, config.onComplete]
  );

  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    fetch();
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  return response;
};
