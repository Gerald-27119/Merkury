export default function Photo({ photo, onClick = () => {}, ...props }) {
  return (
    <div onClick={onClick} className="w-fit h-fit">
      <img {...props} src={photo.url} alt={photo.alt} />
    </div>
  );
}
