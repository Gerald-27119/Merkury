# Projekt zrealizowany przez :

- Kacper Badek
- Adam Langmesser
- Stanisław Oziemczuk
- Mateusz Redosz

---
# Instrukcja uruchomienia

## 1) Wymagania wstępne

* Docker + Docker Compose
* Java 21 + Maven 3.9.9
* Node.js 24.9.0 + npm 11.6.0

---

## 2) Konfiguracja zmiennych środowiskowych

### Backend (vulcanus)

Należy dodać do zmiennych środowiskowych systemu następujące wartości:

* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `merkury_email_password`
* `merkury_email_username`
* `AZURE_STORAGE_CONNECTION_STRING`
* `MERKURY_GIF_PROVIDER_API_KEY`
* `MERKURY_LOCATIONQ_PROVIDER_API_KEY`

---

### Frontend (venus)

Należy utworzyć plik:

* `venus/.env`

i umieścić w nim:

```env
VITE_MERKURY_BASE_URL=http://localhost:8080
```

Backend domyślnie uruchamiany jest na porcie 8080,
jego zmiana wymaga aktualizacji tej wartości zmiennej 
środowiskowe tak, aby wskazywała właściwy adres.

---

## 3) Uruchomienie bazy danych (Docker Compose)

Baza danych uruchamiana jest przez Docker Compose znajdujący się w:

* `vulcanus/docker/merkury`

Aby uruchomić bazę danych, należy wykonać:

```bash
cd vulcanus/docker/merkury
docker compose up -d
```

Aby zatrzymać bazę danych, należy wykonać:

```bash
docker compose down
```

---

## 4) Uruchomienie backendu (Java, vulcanus)

W nowym terminalu należy przejść do katalogu backendu:

```bash
cd vulcanus
```

Następnie należy uruchomić aplikację:

```bash
./mvnw spring-boot:run
```

Dla systemu Windows:

```bash
mvnw.cmd spring-boot:run
```

Backend powinien być dostępny pod adresem:

* `http://localhost:8080`

---

## 5) Uruchomienie frontendu (React/Vite, venus)

W kolejnym terminalu należy wykonać:

```bash
cd venus
npm ci
npm run dev
```

Frontend domyślnie powinien być dostępny pod adresem:

* `http://localhost:5173`
---