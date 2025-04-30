export function formatSentAgo(date: string): string {
  const now = new Date();
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
}

export function formatSentAt(date: string): string {
  const now = new Date();
  const d = new Date(date);

  // same-day → HH:mm
  if (
    now.getFullYear() === d.getFullYear() &&
    now.getMonth() === d.getMonth() &&
    now.getDate() === d.getDate()
  ) {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const daysAgo = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );

  // within last 7 days → weekday name
  if (daysAgo < 7) {
    return d.toLocaleDateString(undefined, { weekday: "long" });
  }

  // same year → day + month
  if (now.getFullYear() === d.getFullYear()) {
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  // older → year + day + month
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMessageLength(message: string): string {
  const messageLength = message.length;
  if (messageLength > 10) {
    return `${message.substring(0, 10)}...`;
  }
  return message;
}
