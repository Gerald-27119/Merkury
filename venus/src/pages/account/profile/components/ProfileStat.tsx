interface ProfileStatsProps {
  value: number | undefined;
  label: string;
}

export default function ProfileStat({ value, label }: ProfileStatsProps) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-3">
      <p className="text-darkBorder text-2xl">{label}</p>
      <p className="group-hover:text-shadow-darkText text-4xl">{value ?? 0}</p>
    </div>
  );
}
