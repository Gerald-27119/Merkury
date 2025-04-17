export default function Profile() {
  return (
    <div className="dark:bg-darkBg dark:text-darkText flex h-screen w-full flex-col items-center justify-around">
      <div className="flex">
        <div>
          <img
            alt="profileImage"
            src="https://preview.redd.it/apple-cat-v0-8j62im9huxad1.jpeg?width=1080&crop=smart&auto=webp&s=2216680d98bf88d28c752a887b30d1194e15189a"
            className="aspect-square h-96 rounded-full"
          />
        </div>
        <div>
          <p className="text-3xl text-shadow-lg">Ludwik Kot</p>
          <div className="flex">
            <div className="flex flex-col">
              <p className="text-darkBorder">Followers</p>
              <p>21</p>
            </div>
            <div className="flex flex-col">
              <p className="text-darkBorder">Followed</p>
              <p>45</p>
            </div>
            <div className="flex flex-col">
              <p className="text-darkBorder">Friends</p>
              <p>37</p>
            </div>
            <div className="flex flex-col">
              <p className="text-darkBorder">Photos</p>
              <p>65</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
}
