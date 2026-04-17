import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [lastSeenUsers, setLastSeenUsers] = useState({});
  const typingTimersRef = useRef(new Map());
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const clearTypingTimer = (userId) => {
    const timer = typingTimersRef.current.get(String(userId));
    if (timer) {
      clearTimeout(timer);
      typingTimersRef.current.delete(String(userId));
    }
  };

  const markTyping = (userId) => {
    const typingKey = String(userId);

    setTypingUsers((prev) => ({
      ...prev,
      [typingKey]: true,
    }));

    clearTypingTimer(typingKey);

    const timer = setTimeout(() => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[typingKey];
        return next;
      });
      typingTimersRef.current.delete(typingKey);
    }, 1800);

    typingTimersRef.current.set(typingKey, timer);
  };

  const clearTyping = (userId) => {
    const typingKey = String(userId);
    clearTypingTimer(typingKey);
    setTypingUsers((prev) => {
      const next = { ...prev };
      delete next[typingKey];
      return next;
    });
  };

  useEffect(() => {
    let currentSocket = null;

    if (isAuthenticated && user) {
      setOnlineUsers([]);
      setTypingUsers({});
      setLastSeenUsers({});

      currentSocket = io("http://localhost:5000", {
        query: {
          userId: user._id,
        },
      });

      setSocket(currentSocket);

      currentSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      currentSocket.on("user_online", ({ userId, lastSeenAt }) => {
        const onlineKey = String(userId);
        setOnlineUsers((prev) =>
          prev.includes(onlineKey) ? prev : [...prev, onlineKey],
        );
        if (lastSeenAt) {
          setLastSeenUsers((prev) => ({
            ...prev,
            [onlineKey]: lastSeenAt,
          }));
        }
      });

      currentSocket.on("user_offline", ({ userId, lastSeenAt }) => {
        const offlineKey = String(userId);
        setOnlineUsers((prev) => prev.filter((id) => String(id) !== offlineKey));
        clearTyping(offlineKey);
        if (lastSeenAt) {
          setLastSeenUsers((prev) => ({
            ...prev,
            [offlineKey]: lastSeenAt,
          }));
        }
      });

      currentSocket.on("typing", ({ userId }) => {
        if (!userId) return;
        markTyping(userId);
      });

      currentSocket.on("stop_typing", ({ userId }) => {
        if (!userId) return;
        clearTyping(userId);
      });
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      setOnlineUsers([]);
      setTypingUsers({});
      setLastSeenUsers({});
    }

    return () => {
      if (currentSocket) {
        currentSocket.close();
      }
      typingTimersRef.current.forEach((timer) => clearTimeout(timer));
      typingTimersRef.current.clear();
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, typingUsers, lastSeenUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};
