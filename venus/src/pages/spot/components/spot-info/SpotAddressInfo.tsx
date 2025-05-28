type SpotAddressInfoProps = {
  country: string;
  city: string;
  street: string;
};

export default function SpotAddressInfo({
  country,
  city,
  street,
}: SpotAddressInfoProps) {
  return (
    <div className="flex flex-wrap text-lg underline underline-offset-2">
      <span>{country},&nbsp;</span>
      <span>{city},&nbsp;</span>
      <span>{street}</span>
    </div>
  );
}
