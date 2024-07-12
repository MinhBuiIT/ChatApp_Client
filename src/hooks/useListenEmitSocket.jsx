import React from 'react';

const useListenEmitSocket = (socket, obj) => {
  const entriesObj = Object.entries(obj);
  React.useEffect(() => {
    entriesObj.forEach(([key, value]) => {
      socket.on(key, value);
    });
    return () => {
      entriesObj.forEach(([key, value]) => {
        socket.off(key, value);
      });
    };
  }, [socket, entriesObj]);
  return null;
};

export default useListenEmitSocket;
