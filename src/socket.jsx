import { createContext, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();
const getSocketContext = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(SocketContext);
};
const socket = io(import.meta.env.VITE_BASE_URL, {
  withCredentials: true
});
const SocketContextComponent = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketContextComponent;
export { getSocketContext, SocketContext };
