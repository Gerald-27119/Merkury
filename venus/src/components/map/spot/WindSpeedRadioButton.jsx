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
        className="relative flex items-center cursor-pointer"
        htmlFor={`windHeight_${value}`}
      >
        <input
          type="radio"
          checked={closestValue === value}
          value={value}
          name="windHeight"
          id={`windHeight_${value}`}
          onChange={onChange}
          className="peer h-7 w-7 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-100 checked:border-slate-300 transition-all"
        />
        <span className="absolute bg-slate-800 w-5 h-5 opacity-0 rounded-md peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
      </label>
      <label htmlFor={`windHeight_${value}`}>{value}m</label>
    </div>
  );
}
