import Comment from "./Comment.jsx";

export default function Comments({ comments }) {
  return (
    <>
      {comments && comments.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <p className="text-lg">Comments:</p>
          <ul>
            {comments.map((comment) => (
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
