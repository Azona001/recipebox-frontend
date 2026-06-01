import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
  const [debounceSearch, setDebounceSearch] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounceSearch(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceSearch;
};

export default useDebounce;
