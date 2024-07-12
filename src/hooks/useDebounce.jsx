import { useEffect, useState } from 'react';

const useDebounce = (searchValue, delay) => {
  const [debounceValue, setDebounceValue] = useState(searchValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(searchValue);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);
  return debounceValue;
};

export default useDebounce;
