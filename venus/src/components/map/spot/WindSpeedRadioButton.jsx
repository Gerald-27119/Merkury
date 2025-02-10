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
      <input
        type="radio"
        checked={closestValue === value}
        value={value}
        name="windHeight"
        id={`windHeight_${value}`}
        onChange={onChange}
      />
      <label htmlFor={`windHeight_${value}`}>{value}m</label>
    </div>
  );
}
