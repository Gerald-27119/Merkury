import { Friend } from "../../../model/interface/account/friends/friend";
import FriendCard from "./components/FriendCard";

const list: Friend[] = [
  {
    username: "alice123",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/0b082f92-d937-426e-97cb-7daf82fd38dc/rasy%20kot%C3%B3w%20d%C5%82ugow%C5%82osych.jpeg?w=1920&q=75&auto=format",
  },
  {
    username: "bob_the_builder",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/68d8d7c6-4fb3-432f-9298-f3e7640358a4/Maine%20coon.jpeg?w=750&q=75&auto=format",
  },
  {
    username: "charlie89",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/eafd6c6f-d3cf-4cf8-98f9-f1e1823be76a/Kot%20Norweski%20Le%C5%9Bny.jpeg?w=1920&q=75&auto=format",
  },
  {
    username: "diana_rose",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/505f8529-3095-4e43-a383-b0f16111cd04/kot%20perski.jpeg?w=1920&q=75&auto=format",
  },
  {
    username: "edward99",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/b94cdb3f-1e0a-4535-af91-6ff2d4ef5f7e/kot%20neva%20masquerade.jpeg?w=1920&q=75&auto=format",
  },
  {
    username: "fiona_sky",
    profilePhoto:
      "https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/232e7ca6-3faf-4d97-a62f-71fe3ab8537f/kot%20ragdoll.jpeg?w=1200&q=75&auto=format",
  },
];

export default function Friends() {
  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText flex h-full w-full flex-col space-y-8 p-10">
      <h1 className="ml-27 text-4xl font-semibold capitalize">friends list</h1>
      <div className="flex flex-wrap items-center justify-center gap-5">
        {list.map((f) => (
          <FriendCard friend={f} key={f.username} />
        ))}
      </div>
    </div>
  );
}
