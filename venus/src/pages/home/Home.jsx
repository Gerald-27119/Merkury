import { ConfigProvider, Rate } from "antd";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex text-darkText">
      <div className="w-1/4 bg-darkBgSoft flex flex-col items-center space-y-4">
        <h1 className="text-3xl uppercase font-semibold text-center mt-3">
          Filters
        </h1>
        <div className="flex flex-col w-full items-center space-y-1">
          <label className="font-semibold text-lg">Sort</label>
          <select className="py-2 px-3 rounded-md w-3/4 focus:outline-none bg-darkBgMuted focus:ring-1 dark:focus:ring-darkBorder focus:ring-lightBorder">
            <option>Default</option>
            <option>Increase by name</option>
            <option>Decrease by name</option>
            <option>Increase by rating</option>
            <option>Decrease by rating</option>
          </select>
        </div>
        <div className="flex flex-col w-full items-center space-y-1">
          <label className="font-semibold text-lg ">City</label>
          <input
            type="text"
            className="py-2 px-3 rounded-md  w-3/4 focus:outline-none bg-darkBgMuted focus:ring-1 dark:focus:ring-darkBorder focus:ring-lightBorder"
          />
        </div>
        <div className="flex flex-col w-3/4 items-center space-y-1">
          <h1 className="font-semibold text-lg">Rating</h1>
          <div className="flex justify-around bg-darkBgMuted pb-2 pt-1 rounded-md w-full">
            <div className="flex flex-col">
              <label className=" uppercase">from</label>
              <ConfigProvider
                theme={{
                  components: {
                    Rate: {
                      starBg: "#939394",
                    },
                  },
                }}
              >
                <Rate allowHalf />
              </ConfigProvider>
            </div>
            <div className="flex flex-col">
              <label className=" uppercase">to</label>
              <ConfigProvider
                theme={{
                  components: {
                    Rate: {
                      starBg: "#939394",
                    },
                  },
                }}
              >
                <Rate allowHalf value={2} />
              </ConfigProvider>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-3/4">
          <div className="hover:bg-darkBgMuted space-x-2 py-1 px-2 flex items-center">
            <input
              type="checkbox"
              id="tag1"
              className="appearance-none p-3 checked:bg-darkBg bg-darkBgMuted rounded-md hover:ring-1 hover:ring-darkBorder checked:ring-1 checked:ring-darkBorder"
            />
            <label className=" w-full" htmlFor="tag1">
              Tag 1
            </label>
          </div>
          <div className="hover:bg-darkBgMuted space-x-2 py-1 px-2 flex items-center">
            <input
              type="checkbox"
              id="tag2"
              className="appearance-none p-3 checked:bg-darkBg bg-darkBgMuted rounded-md hover:ring-1 hover:ring-darkBorder checked:ring-1 checked:ring-darkBorder"
            />
            <label className=" w-full" htmlFor="tag2">
              Tag 2
            </label>
          </div>
          <div className="hover:bg-darkBgMuted space-x-2 py-1 px-2 flex items-center">
            <input
              type="checkbox"
              id="tag3"
              className="appearance-none p-3 checked:bg-darkBg bg-darkBgMuted rounded-md hover:ring-1 hover:ring-darkBorder checked:ring-1 checked:ring-darkBorder"
            />
            <label className=" w-full" htmlFor="tag3">
              Tag 3
            </label>
          </div>
        </div>
        <div className="w-full flex flex-col items-center space-y-2">
          <label className="font-semibold text-lg">Drone weight</label>
          <input
            type="range"
            min={0}
            max={2000}
            className="appearance-none w-3/4 h-2 py-2 bg-darkBgMuted rounded-md focus:outline-none accent-darkText"
          />
        </div>
      </div>
      <div className="w-3/4 bg-darkBg flex flex-col items-center space-y-4 p-3 ">
        <h1 className="text-6xl font-semibold uppercase">All spots</h1>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
          <div className="h-fit w-96 flex flex-col p-2 bg-darkBgSoft rounded-md">
            <img
              className="h-3/4 rounded-md"
              src="https://gdansk.pja.edu.pl/wp-content/uploads/2024/03/Bednarczyk-czarno-biale-edited.jpg"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-center">Title</h1>
                <div className="flex flex-col items-end space-y-2 p-2">
                  <ConfigProvider
                    theme={{
                      components: {
                        Rate: {
                          starBg: "#939394",
                        },
                      },
                    }}
                  >
                    <Rate allowHalf disabled value={4} />
                  </ConfigProvider>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 1
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 2
                    </span>
                    <span className="border border-darkBorder p-1 rounded-md">
                      Tag 3
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-base break-words">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                eleifend elit sed pellentesque malesuada. Curabitur augue arcu,
                pharetra at tortor id, venenatis volutpat erat.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
