interface DateBadgeProps {
  date: string;
}

export default function DateBadge({ date }: DateBadgeProps) {
  return (
    <div className="dark:bg-darkBgMuted w-full rounded-md p-2">
      <p className="text-2xl">{new Date(date).toLocaleDateString("pl-Pl")}</p>
    </div>
  );
}
