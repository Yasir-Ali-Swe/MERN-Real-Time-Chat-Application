export const formatLastSeen = (lastSeenAt) => {
  if (!lastSeenAt) return "offline";

  const date = new Date(lastSeenAt);
  if (Number.isNaN(date.getTime())) return "offline";

  return `last seen at ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const getUserPresenceStatus = ({
  userId,
  onlineUsers = [],
  typingUsers = {},
  lastSeenAt = null,
}) => {
  const id = String(userId || "");

  if (typingUsers?.[id]) {
    return {
      text: "typing...",
      type: "typing",
    };
  }

  if (onlineUsers.map(String).includes(id)) {
    return {
      text: "online",
      type: "online",
    };
  }

  return {
    text: formatLastSeen(lastSeenAt),
    type: "offline",
  };
};
