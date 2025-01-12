import Button from "../../../pages/account/Button.jsx";

export default function FavouriteSpot({ spot, handleRemove }) {
  return (
    <div
      key={spot.id}
      className="flex items-center justify-between bg-white rounded-md p-4 mb-4 shadow-md"
    >
      {spot.photos && spot.photos.length > 0 ? (
        <img
          src={spot.photos[0].img}
          alt={spot.photos[0].title}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm text-gray-500">No Image</span>
        </div>
      )}

      <p className="flex-1 px-4 text-gray-800 font-medium">{spot.name}</p>

      <Button
        classNames="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
        onClick={() => handleRemove(spot.id)}
      >
        Remove
      </Button>
    </div>
  );
}
