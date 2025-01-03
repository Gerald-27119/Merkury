import { useMutation } from "@tanstack/react-query";
import { addComment } from "../../../http/comments.js";
import { spotDetailsModalAction } from "../../../redux/spot-modal.jsx";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function CommentForm({ id }) {
  const spotId = id;
  const [newCommentText, setNewCommentText] = useState("");
  //const dispatch = useDispatch();

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: addComment,
  });
  const handleAddComment = async (event) => {
    event.preventDefault();
    mutate(
      {
        text: newCommentText,
        spotId: spotId,
      },
      spotId,
    );
  };

  useEffect(() => {
    if (isSuccess) {
      //dispatch(spotDetailsModalAction.updateComments(response.data.comments));
      setNewCommentText("");
    }
  }, [isSuccess, setNewCommentText]);

  return (
    <>
      <div className="add-comment">
        <div className="flex-grow">
          <textarea
            className=""
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Type coment here..."
          />
        </div>
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </>
  );
}
