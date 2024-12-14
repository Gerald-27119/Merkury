export default function Architektura() {

    return (
        <>
            <h1 className="text-4xl mb-8">Wybrane technologie</h1>
            <div className="flex gap-28">
                <ul>
                    <h2 className="text-3xl mb-3">Podział na backend i frontend - REST API</h2>
                    <li>
                        <h2 className="text-3xl mb-3">Backend</h2>
                        <ul>
                            <li>JDK 21</li>
                            <li>Java Spring Boot v3.3.2</li>
                            <li>Maven v4.0.0</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-3xl mb-3">Frontend</h2>
                        <ul>
                            <li>React JS v18.3.1</li>
                            <li>JSX</li>
                            <li>Build tool Vite v5.3.4</li>
                            <li>Tailwind v3.4.7</li>
                        </ul>
                    </li>
                    <li>
                        <h2 className="text-3xl mb-3">Baza danych</h2>
                        <ul>
                            <li>PostgreSQL v42.7.3</li>
                            <li>Aktualnie każdy ma lokalnie na Docker</li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <h2 className="text-3xl mb-3">Reszta narzędzi</h2>
                    <li>Git oraz Github</li>
                    <li>Jira</li>
                    <li>Discord</li>
                    <li>Messenger</li>
                </ul>
            </div>
        </>
    )
}