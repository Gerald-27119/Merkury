export default function Zadania() {

    return (
        <>
            <h2 className="text-4xl mb-10 mt-10">Zadania</h2>
            <div className="flex gap-11">
                <ul>
                    <h2 className="text-3xl mb-4">Założenia</h2>
                    <li>tworzenie dokumentacji</li>
                    <li>rejestracja</li>
                    <li>logowanie</li>
                    <li>resetowanie hasła</li>
                    <li>
                        <h2 className="text-2xl mb-4">interaktywna mapa</h2>
                        <ul>
                            <li>wyświetlanie spotów</li>
                            <li>wyświetlanie lokalizacji użytkownika</li>
                            <li>dodawanie spotów przez użytkownika</li>
                            <li>dodawanie komentarzy do spotów</li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <h2 className="text-3xl mb-4">Jak wyszło?</h2>
                    <li>tworzenie dokumentacji - zrobione</li>
                    <li>rejestracja - zrobione</li>
                    <li>logowanie - zrobione</li>
                    <li>resetowanie hasła - zrobione</li>
                    <li>
                        <h2 className="text-2xl mb-4">interaktywna mapa</h2>
                        <ul>
                            <li>wyświetlanie lokalizacji użytkownika - zrobione</li>
                            <li>wyświetlanie spotów (na razie wyświetlanie paru przykładowych) - zrobione</li>
                            <li>dodawanie spotów przez użytkownika - anulowano</li>
                            <li>dodawanie komentarzy do spotów - w trakcie</li>
                            <li>filtrowanie spotów - do zrobienia</li>
                            <li>wyświetlanie informacji pogodowych - do zrobienia</li>
                            <li>dodanie nowych spotów do bazy danych - do zrobienia</li>
                            <li>dodanie spotów do ulubionych - do zrobienia</li>
                        </ul>
                    </li>
                    <li>ustawienia użytkownika użytkownika (np. zmiana hasła) - do zrobienia</li>
                    <li>komponent Notification na frontend (np. wyświetlenie informacji o błędzie) - zrobione</li>
                    <li>automatyczne wylogowanie użytkownika po 7 dniach nieaktywności - zrobione</li>
                    <li>postawienie instancji Locust'a do symulowania ruchu na endpointach - zrobione</li>
                    <li>wysyłanie maili użytkownikowi przy rejestracji - zrobione</li>
                    <li>stworzenie przykładowych testów (jednostkowe + E2E) na frontendzie - do zrobienia</li>
                    <li>stworzenie przykładowych testów (jednostkowe + E2E) na backendzie - do zrobienia</li>
                </ul>
            </div>
            <div>
                <h2 className="text-3xl mb-2 mt-10">Założyliśmy że przeznaczymy na projekt w ciągu semestru 225h
                </h2>
                <h2 className="text-3xl mb-4 ">
                    Obecnie poświęciliśmy na projekt łącznie 154h i 17min</h2>
            </div>
            <h2 className="text-3xl mb-20 mt-6">Ogólna konkluzja jest taka, że zrobimy więcej w ramach przedmiotu, niż
                                                początkowo planowaliśmy</h2>
        </>
    )
}