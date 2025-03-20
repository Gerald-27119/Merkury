export default function Range() {
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <label className="font-semibold text-lg">Drone weight</label>
      <input
        type="range"
        min={0}
        max={2000}
        className="appearance-none w-full h-2 py-2 bg-darkBgMuted rounded-md focus:outline-none accent-darkText"
      />
    </div>
  );
}
