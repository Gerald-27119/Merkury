import PhotosWithDate from "../../../../model/interface/account/photos/photosWithDate";

interface DateChooserProps {
  type: "from" | "to";
  data: PhotosWithDate;
}

export default function DateChooser({ type, data }: DateChooserProps) {
  let text = "From:";
  let date = data?.[data?.length - 1].date ?? "";

  if (type === "to") {
    text = "To:";
    date = new Date().toISOString().split("T")[0];
  }

  return (
    <div className="flex space-x-2">
      <p>{text}</p>
      <input type="date" defaultValue={date} />
    </div>
  );
}
