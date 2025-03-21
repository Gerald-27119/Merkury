import { useState } from "react";
import { Rate } from "antd";

export default function EditCommentForm({ comment, onSave, onCancel }) {
  const [editedText, setEditedText] = useState(comment.text);
  const [rating, setRating] = useState(comment.rating);

  const handleSave = () => {
    onSave({ text: editedText, rating: rating });
  };

  const handleCommentChange = (text) => {
    setEditedText(text);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <div>
        <Rate allowHalf value={rating} onChange={setRating} />
      </div>
      <textarea
        className="w-full p-2 border rounded resize-none text-base"
        rows="2"
        maxLength="300"
        value={editedText}
        onChange={(e) => handleCommentChange(e.target.value)}
      ></textarea>
      <div className="flex justify-end space-x-2 mt-2">
        <button
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
