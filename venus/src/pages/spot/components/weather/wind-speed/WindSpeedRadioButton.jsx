export default function WindSpeedRadioButton({
    value,
    onChange,
    windHeight,
    allValues,
}) {
    const closestValue = allValues.reduce(
        (prev, curr) => (windHeight >= curr && curr > prev ? curr : prev),
        0,
    );

    return (
        <label
            className="relative flex h-10 w-20 cursor-pointer items-center"
            htmlFor={`windHeight_${value}`}
        >
            <input
                type="radio"
                checked={closestValue === value}
                value={value}
                name="windHeight"
                id={`windHeight_${value}`}
                onChange={onChange}
                className="peer hidden"
            />
            <span className="flex h-full w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-slate-50 font-semibold text-slate-900 transition-all duration-300 peer-checked:bg-slate-700 peer-checked:text-white hover:bg-gray-700 hover:text-white active:scale-95">
                {value}m
            </span>
        </label>
    );
}
