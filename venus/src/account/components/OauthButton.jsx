export default function OauthButton({ children }) {
  return (
    <button className="bg-gray-700 hover:bg-gray-600 flex items-center p-3 mt-2 w-full text-white rounded-md text-lg">
      {children}
    </button>
  );
}
