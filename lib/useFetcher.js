import { useCallback, useEffect, useRef, useState } from "react";
import sdkFetcher, { config } from "./fetcher";

const cache = {};

export default (action, method, path, input, body) => {
  const [response, setResponse] = useState({ data: cache[path] || undefined, error: undefined, loading: false });
  const timeoutRef = useRef({});

  const fetch = useCallback(
    async (prevData) => {
      const { interval, onComplete, onSuccess } = config;
      try {
        !prevData && setResponse((prev) => ({ ...prev, loading: true }));
        const res = await sdkFetcher(action, method, path, input, body, true);
        if (!prevData || (cache[path] && cache[path] !== prevData)) {
          cache[path] = res;
          console.log({ res });
          const data = JSON.parse(res);
          setResponse({ data, error: undefined, loading: false });
          onSuccess && onSuccess({ data, response, action, method, path, input, body, isHook: true });
          onComplete && onComplete({ data, response, action, method, path, input, body, isHook: true });
        }
        timeoutRef.current = setTimeout(() => fetch(res), interval);
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
