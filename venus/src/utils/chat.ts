function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function formatFullDateTime(d: Date): string {
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const hh = pad2(d.getHours());
    const min = pad2(d.getMinutes());
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export function formatSentAt(date: string): string {
    const now = new Date();
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "";

    if (
        now.getFullYear() === d.getFullYear() &&
        now.getMonth() === d.getMonth() &&
        now.getDate() === d.getDate()
    ) {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }

    const daysAgo = Math.floor(
        (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysAgo < 7) {
        return d.toLocaleDateString(undefined, { weekday: "long" });
    }

    return formatFullDateTime(d);
}

export function formatMessageLength(message: string): string {
    const messageLength = message.length;
    if (messageLength > 6) {
        return `${message.substring(0, 6)}...`;
    }
    return message;
}
