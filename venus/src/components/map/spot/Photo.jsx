export default function Photo({ photo, onClick = () => {}, ...props }) {
  return (
    <div className="w-fit h-fit" onClick={photo ? onClick : undefined}>
      {photo ? (
        <img {...props} src={photo.img} alt={photo.title} />
      ) : (
        <p>No photo to display</p>
      )}
    </div>
  );
}
