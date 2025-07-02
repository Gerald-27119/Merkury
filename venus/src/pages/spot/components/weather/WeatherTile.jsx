export default function WeatherTile({ children }) {
    return (
        <div className="flex grow items-center justify-center rounded-xl bg-white p-4 text-3xl shadow-md">
            {children}
        </div>
    );
}
