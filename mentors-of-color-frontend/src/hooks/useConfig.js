import { useContext } from 'react';
import { ConfigContext } from 'contexts/ConfigContext';

const useConfig = () => {
  return useContext(ConfigContext);
};

export default useConfig;
