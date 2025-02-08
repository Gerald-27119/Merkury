import Comment from "./Comment.jsx";
import Error from "../../error/Error.jsx";

export default function Comments({ spotId }) {
  return (
    <>
      {error && <Error error={error} />}
      {data && data?.content.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <p className="text-lg">Comments:</p>
          <ul>
            {data.content.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <span>There are no comments!</span>
      )}
    </>
  );
}
