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
                className="w-full resize-none rounded-sm border p-2 text-base"
                rows="2"
                maxLength="300"
                value={editedText}
                onChange={(e) => handleCommentChange(e.target.value)}
            ></textarea>
            <div className="mt-2 flex justify-end space-x-2">
                <button
                    className="rounded-sm bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400"
                    onClick={handleSave}
                >
                    Save
                </button>
                <button
                    className="rounded-sm bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
