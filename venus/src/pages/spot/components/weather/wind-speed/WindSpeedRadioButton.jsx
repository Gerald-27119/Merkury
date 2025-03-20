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
        className="text-darkText font-semibold h-full w-full flex items-center justify-center
          rounded-md bg-darkBorder transition-all duration-300 cursor-pointer
          hover:bg-mainBlueDarker active:scale-95 peer-checked:text-darkText peer-checked:bg-mainBlue"
      >
        {value}m
      </span>
    </label>
  );
}
