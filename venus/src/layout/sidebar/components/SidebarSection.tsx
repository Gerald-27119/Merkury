import { ReactElement } from "react";

interface SidebarSectionProps {
  children: ReactElement;
  showTopHr?: boolean;
  showBottomHr?: boolean;
}

const hrClasses = "border-violetLight mx-2 mt-1 mb-2";

export default function SidebarSection({
  children,
  showTopHr,
  showBottomHr,
}: SidebarSectionProps) {
  return (
    <nav className="flex flex-col space-y-1">
      {showTopHr && <hr className={hrClasses} />}
      {children}
      {showBottomHr && <hr className={hrClasses} />}
    </nav>
  );
}
