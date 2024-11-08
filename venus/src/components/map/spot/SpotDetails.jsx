export default function SpotDetails({ spot }) {
  return (
    <div>
      <h2>{spot.name}</h2>
      <p>{spot.description}</p>
      <p>{spot.rating}</p>
      {spot.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <p>{comment.rating}</p>
        </div>
      ))}
    </div>
  );
}
