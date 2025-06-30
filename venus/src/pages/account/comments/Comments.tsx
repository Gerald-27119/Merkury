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
      <ul className="mx-27 space-y-5">
        {data?.map((d, index) => (
          <li key={index} className="flex flex-col space-y-5">
            <span className="bg-darkBgMuted flex w-full space-x-6 rounded-md px-2 py-1.5 text-xl">
              <p className="font-semibold">{d.addDate}</p>
              <span className="flex">
                Comments to
                <p className="text-violetLight mx-2">{d.spotName}</p>
                spot
              </span>
            </span>
            <ul className="ml-20 space-y-3">
              {d.comments.map((c) => (
                <li
                  key={c.id}
                  className="bg-darkBgSoft flex flex-col rounded-md px-2 py-1.5"
                >
                  <p className="text-darkBorder">{c.addTime}</p>
                  <p className="text-lg">{c.text}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
