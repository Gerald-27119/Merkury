import { NavLink } from "react-router-dom";
import { ReactElement } from "react";
import { GoDotFill } from "react-icons/go";

interface SidebarItemProps {
  to: string;
  icon: ReactElement;
  name: string;
  isSidebarOpen: boolean;
  onChangeTheme?: () => void;
  isMiddlePart?: boolean;
}

export default function SidebarItem({
  to,
  icon,
  name,
  isSidebarOpen,
  onChangeTheme,
  isMiddlePart,
}: Readonly<SidebarItemProps>) {
  const content = (isActive: boolean): ReactElement => (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        {icon}
      </div>
      <p
        className={`flex min-w-[10rem] items-center text-start text-base font-semibold capitalize transition-opacity duration-300 ${!isSidebarOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {name}
        {!isMiddlePart && isActive && <GoDotFill className="ml-2" />}
      </p>
    </>
  );

  if (!to) {
    return (
      <button
        type="button"
        onClick={name !== "notification" ? onChangeTheme : undefined}
        className="flex w-full cursor-pointer items-center space-x-4 rounded-md p-2 transition-all"
      >
        {content(false)}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex w-full items-center space-x-4 rounded-md p-2 transition-all ${isMiddlePart && "hover:bg-violetLight"} ${isActive && isMiddlePart && "bg-violetLight"}`
      }
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  );
}
