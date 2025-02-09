export default function LoadingSpinner() {
  const delays = ["-0.45s", "-0.3s", "-0.15s", "0s"];

  return (
    <div className="flex justify-center items-center">
      {/* Container for the rings */}
      <div className="relative w-16 h-16">
        {delays.map((delay, idx) => (
          <div
            key={idx}
            style={{ animationDelay: delay }}
            className="absolute top-0 left-0 w-16 h-16 m-2 border-8 rounded-full
                       border-t-[#e30d5b] border-r-transparent border-b-transparent border-l-transparent
                       animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite]"
          />
        ))}
      </div>
    </div>
  );
}
