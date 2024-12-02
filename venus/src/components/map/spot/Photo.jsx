export default function Photo({ photo }) {
  return <img src={photo.img} alt={photo.title} />;
}
