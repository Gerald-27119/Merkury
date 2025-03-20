import { useState } from "react";
import { ConfigProvider, Rate } from "antd";

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
    <div className="space-y-2">
      <div>
        <ConfigProvider
          theme={{
            components: {
              Rate: {
                starBg: "#939394",
              },
            },
          }}
        >
          <Rate allowHalf value={rating} onChange={setRating} />
        </ConfigProvider>
      </div>
      <textarea
        className="w-full p-2 rounded-md resize-none text-base bg-darkBorder focus:ring-0 focus:outline-0"
        rows="2"
        maxLength="300"
        value={editedText}
        onChange={(e) => handleCommentChange(e.target.value)}
      ></textarea>
      <div className="flex justify-end space-x-2 mt-2">
        <button
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-mainBlue text-white rounded hover:bg-mainBlueDarker"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
