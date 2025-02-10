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
    <div className="flex space-x-2 items-center">
      <label
        className="relative flex items-center cursor-pointer w-20 h-10"
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
        <span
          className="text-slate-900 font-semibold h-full w-full flex items-center justify-center
          rounded-md border border-slate-300 bg-slate-50 transition-all duration-300 cursor-pointer
          hover:bg-gray-700 hover:text-white active:scale-95 peer-checked:text-white peer-checked:bg-slate-700"
        >
          {value}m
        </span>
      </label>
    </div>
  );
}
