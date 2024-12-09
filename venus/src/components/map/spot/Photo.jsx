export default function Photo({ photo, onClick = () => {}, ...props }) {
  return (
    <div onClick={onClick} className="w-fit h-fit">
      <img {...props} src={photo.img} alt={photo.title} />
    </div>
  );
}
