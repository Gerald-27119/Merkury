import Button from "./components/Button.jsx";

export default function MainView() {
  return (
    <div className="p-px h-dvh bg-neutral-700 flex flex-col items-center justify-center">
      <div className="h-1/10 w-screen bg-basalt flex m-1 rounded-b border-b-2 border-b-gold"></div>
      <div className="p-px h-full w-screen flex flex-row">
        <div className=" flex flex-col-reverse h-full w-auto bg-basalt rounded-r border-r-2 border-r-gold basis-1/5 grow">
          <div className="bottom-0 flex h-1/10 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold">
            <div>
              <Button />
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-col-reverse h-full w-auto basis-1/3 grow">
          <div className="bottom-0 flex h-1/10 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>
        </div>
        <div className="flex flex-col-reverse h-full w-auto bg-basalt rounded-l border-l-2 border-l-gold basis-1/5 grow">
          <div className="bottom-0 flex h-1/10 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>
        </div>
      </div>
      {/*<div className="h-1/10 w-screen flex">*/}
      {/*    <div className="flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
      {/*    <div className="flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
      {/*    <div className="flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
      {/*</div>*/}
      {/*<div className="bottom 0 absolute flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
      {/*<div className="bottom 0 absolute flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
      {/*<div className="bottom 0 absolute flex basis-1/3 w-auto bg-basalt m-1 rounded-t-2xl border-t-2 border-t-gold"></div>*/}
    </div>
  );
}
