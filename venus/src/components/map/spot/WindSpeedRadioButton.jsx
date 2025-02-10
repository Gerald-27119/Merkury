export default function WindSpeedRadioButton({ value, onChange, windHeight }) {
  return (
    <div className="flex space-x-2 items-center">
      <input
        type="radio"
        defaultChecked={value === 0}
        checked={windHeight >= value}
        value={value}
        name="windHeight"
        id={`windHeight_${value}`}
        onChange={onChange}
      />
      <label htmlFor={`windHeight_${value}`}>{value}m</label>
    </div>
  );
}
