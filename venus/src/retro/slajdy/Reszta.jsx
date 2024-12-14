export default function Reszta() {

    return (
        <>
            <ul className="flex flex-col w-2/3">
                <li>
                    <h2>Jak wygląda obieg informacji w zespole?</h2>
                    <p>Widujemy się codziennie na uczelni, więc konsultujemy się face to face. Oprócz tego mamy w ciągu
                       tygodnia łącznie 6h okienka
                       więc w tym czasie też często dyskutujemy o projekcie, zdarzy się także pair-programming albo
                       wspólne omawianie PRa.
                       Krótkie informacje przekazujemy sobie Messengerem, a dłuższe dyskusje prowadzimy na Discordzie na
                       czasie głosowym.</p>
                </li>
                <li>
                    <h2 className="mt-6">Czego się nauczyliśmy?</h2>
                    <ul>
                        <li>Nauczyliśmy się przebiegu Code Review podczas Pull Requestów na Githubie</li>
                        <li>Korzystania z JIRa</li>
                        <li>Korzystania z GITa</li>
                        <li>Korzystania z Docker</li>
                    </ul>
                </li>
            </ul>
        </>
    )
}
