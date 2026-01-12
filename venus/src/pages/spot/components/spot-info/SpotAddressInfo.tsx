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
        <div className="dark:text-darkText text-violetDarkText flex flex-wrap text-lg underline underline-offset-2">
            <span>{country},&nbsp;</span>
            <span>{city},&nbsp;</span>
            <span>{street}</span>
        </div>
    );
}
