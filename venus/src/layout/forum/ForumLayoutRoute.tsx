import { Outlet } from "react-router-dom";
import ForumLayout from "../../pages/forum/ForumLayout";

export default function ForumLayoutRoute() {
    return (
        <ForumLayout>
            <Outlet />
        </ForumLayout>
    );
}
