export default function Photo({ photo, onClick = () => {}, ...props }) {
  if (!photo) {
    return (
      <div className="w-fit h-fit">
        <p>No photo to display</p>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="w-fit h-fit">
      <img {...props} src={photo.img} alt={photo.title} />
    </div>
  );
}
