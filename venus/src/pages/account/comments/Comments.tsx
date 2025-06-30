import { useQuery } from "@tanstack/react-query";
import { getAllUserComments } from "../../../http/user-dashboard";
import AccountTitle from "../components/AccountTitle";

export default function Comments() {
  const { data } = useQuery({
    queryKey: ["comments"],
    queryFn: getAllUserComments,
  });

  console.log(data);

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <AccountTitle text="Comments" />
      <ul className="ml-27 space-y-5">
        {data?.map((d, index) => (
          <li key={index} className="flex flex-col space-y-5">
            <span className="flex space-x-2">
              <p>{d.addDate}</p>
              <p>{d.spotName}</p>
            </span>
            <ul className="ml-20 space-y-1.5">
              {d.comments.map((c) => (
                <li key={c.id} className="flex space-x-4">
                  <p>{c.addTime}</p>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
