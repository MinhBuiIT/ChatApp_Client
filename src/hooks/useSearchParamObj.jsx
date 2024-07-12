import { useSearchParams } from 'react-router-dom';

const useSearchParamObj = () => {
  const [searchParams] = useSearchParams();
  return Object.fromEntries([...searchParams]);
};

export default useSearchParamObj;
