import { NavLink } from "react-router-dom";
import { ReactElement } from "react";

interface SidebarItemProps {
  to: string;
  icon: ReactElement;
  name: string;
  isSidebarOpen: boolean;
  onChangeTheme?: () => {};
}

export default function SidebarItem({
  to,
  icon,
  name,
  isSidebarOpen,
  onChangeTheme,
}: Readonly<SidebarItemProps>) {
  const content: ReactElement = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        {icon}
      </div>
      <p
        className={`min-w-[8rem] text-start text-base font-semibold capitalize transition-opacity duration-300 ${!isSidebarOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {name}
      </p>
    </>
  );

  if (!to) {
    return (
      <button
        type="button"
        onClick={name !== "notification" ? onChangeTheme : undefined}
        className="hover:bg-violetLight flex w-full items-center space-x-4 rounded-md p-2 transition-all"
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end
      className="hover:bg-violetLight flex w-full items-center space-x-4 rounded-md p-2 transition-all"
    >
      {content}
    </NavLink>
  );
}
