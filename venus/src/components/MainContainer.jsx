export default function MainContainer({ children }) {
  return (
    <div className="h-screen bg-[url('/bg-form.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center w-screen">
      <div className="bg-amber-400 w-[30rem] rounded-md px-10 py-8 flex flex-col h-full justify-center">
        {children}
      </div>
    </div>
  );
}
