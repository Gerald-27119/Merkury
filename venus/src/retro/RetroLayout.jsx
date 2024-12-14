import {NavLink, Outlet} from "react-router-dom";
import './style.css';

export default function RetroLayout() {
    const activeClassNames =
        "underline underline-offset-7 decoration-text-fuchsia-100 decoration-2";

    return (
        <>
            <header className="bg-gray-800 text-white p-4 flex w-full text-3xl">
                <nav className="flex gap-20 w-full justify-center">
                    <NavLink
                        to="/retro1"
                        end
                        className={({isActive}) => (isActive ? activeClassNames : "")}
                    >
                        Metoda Zarządzania Projektem

                    </NavLink>
                    <NavLink
                        to="architektura"
                        end
                        className={({isActive}) => (isActive ? activeClassNames : "")}
                    >
                        Architektura

                    </NavLink>
                    <NavLink
                        to="zadania"
                        end
                        className={({isActive}) => (isActive ? activeClassNames : "")}
                    >
                        Zadania

                    </NavLink>
                    <NavLink
                        to="reszta"
                        end
                        className={({isActive}) => (isActive ? activeClassNames : "")}
                    >
                        Reszta

                    </NavLink>

                </nav>
            </header>
            <main className="flex flex-col justify-center items-center min-h-screen">
                <Outlet/>
            </main>
        </>
    );
}
