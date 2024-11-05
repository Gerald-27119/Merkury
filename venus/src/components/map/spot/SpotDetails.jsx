import PropTypes from "prop-types";

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

SpotDetails.propTypes = {
  spot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    rating: PropTypes.number,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        text: PropTypes.string,
        rating: PropTypes.number,
      }),
    ),
  }).isRequired,
};
