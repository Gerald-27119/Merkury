export default function Button({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-rose-600 rounded align-middle text-center text-stone-100"
    >
      Sign out
    </button>
  );
}
