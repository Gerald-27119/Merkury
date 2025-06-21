import { FaPlus } from "react-icons/fa6";

export default function SpotCommentHeader() {
  return (
    <div>
      <h3>Comments</h3>
      <div>
        <FaPlus />
        <button>Add</button>
      </div>
    </div>
  );
}
