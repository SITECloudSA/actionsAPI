import { useCallback, useEffect, useRef, useState } from "react";
import sdkFetcher, { config } from "./fetcher";
import localForage from "localforage";

const cache = {};

const LocalForage = () => {
  localForage.config({
    driver: localForage.INDEXEDDB,
    name: "actionApi",
    version: 1.0,
  });

  return localForage;
};

export default (action, method, path, input, body) => {
  const [response, setResponse] = useState({ data: cache[path] || undefined, error: undefined, loading: false });
  const timeoutRef = useRef({});
  const indexDbKey = `${config.indexdbPrefix}-${path}`;

  const populate = useCallback(async () => {
    const data = await LocalForage().getItem(indexDbKey);
    if (data) {
      cache[path] = data;
      console.log({ db: cache[path] });
      setResponse((prev) => ({ ...prev, loading: false, data }));
    }
  }, [path]);

  const fetch = useCallback(async (prevData) => {
    const { interval, onComplete, onSuccess } = config;
    try {
      !prevData && !cache[path] && setResponse((prev) => ({ ...prev, loading: true }));
      const res = await sdkFetcher(action, method, path, input, body, true);
      if (!prevData || (cache[path] && cache[path] !== prevData)) {
        cache[path] = res;
        const data = JSON.parse(res);
        setResponse({ data, error: undefined, loading: false });
        onSuccess && onSuccess({ data, response, action, method, path, input, body, isHook: true });
        onComplete && onComplete({ data, response, action, method, path, input, body, isHook: true });
        config.indexdbPrefix && LocalForage().setItem(indexDbKey, data);
      }
      timeoutRef.current = setTimeout(() => fetch(res), interval);
      console.log(timeoutRef.current);
    } catch (error) {
      setResponse({ data: undefined, error, loading: false });
    }
  }, []);

  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    config.indexdbPrefix && populate();
    fetch();
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [config.indexdbPrefix, config.interval, config.onSuccess, config.onComplete]);

  return response;
};
