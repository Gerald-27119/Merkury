interface ProfileStatsProps {
  value: number;
  label: string;
}

export default function ProfileStat({
  value,
  label,
}: Readonly<ProfileStatsProps>) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-3">
      <p className="text-darkBorder text-2xl">{label}</p>
      <p className="group-hover:text-shadow-darkText text-4xl">{value}</p>
    </div>
  );
}
