export default function LoadingSpinner({
    borderTopClass = "border-t-[#e30d5b]",
}) {
    const delays = ["-0.45s", "-0.3s", "-0.15s", "0s"];

    return (
        <div className="flex items-center justify-center">
            <div className="relative h-16 w-16">
                {delays.map((delay, idx) => (
                    <div
                        key={idx}
                        style={{ animationDelay: delay }}
                        className={`absolute top-0 left-0 m-2 h-16 w-16 rounded-full border-8 ${borderTopClass} animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] border-r-transparent border-b-transparent border-l-transparent`}
                    />
                ))}
            </div>
        </div>
    );
}
