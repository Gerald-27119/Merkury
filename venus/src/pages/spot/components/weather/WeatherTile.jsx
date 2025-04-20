export default function WeatherTile({ children }) {
  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-xl shadow-md text-3xl grow">
      {children}
    </div>
  );
}
