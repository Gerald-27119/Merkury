export default function Photo({ photo, onClick, ...props }) {
  return (
    <div onClick={onClick}>
      <img {...props} src={photo.img} alt={photo.title} />
    </div>
  );
}
