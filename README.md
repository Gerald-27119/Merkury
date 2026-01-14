# Projekt zrealizowany przez :

- Kacper Badek
- Adam Langmesser
- Stanisław Oziemczuk
- Mateusz Redosz

---

# Instrukcja uruchomienia

## 1) Wymagania wstępne

* Docker + Docker Compose (v2)
* Java (zgodnie z wersją projektu) i Maven/Gradle (zgodnie z projektem)
* Node.js (zgodnie z projektem) + npm

---

## 2) Konfiguracja zmiennych środowiskowych

### Backend (vulcanus)

Dodaj do zmiennych środowiskowych systemu następujące wartości:

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

Utwórz plik:

* `venus/src/.env`

i dodaj w nim:

```env
VITE_MERKURY_BASE_URL=http://localhost:8080
```

Dostosuj port, jeśli backend działa na innym (np. 8081).

---

## 3) Uruchomienie bazy danych (Docker Compose)

Baza danych jest uruchamiana przez compose znajdujący się w:

* `vulcanus/docker/merkury`

Uruchom:

```bash
cd vulcanus/docker/merkury
docker compose up -d
```

Zatrzymanie bazy:

```bash
docker compose down
```

---

## 4) Uruchomienie backendu (Java, vulcanus)

W nowym terminalu przejdź do katalogu backendu:

```bash
cd vulcanus
```

Następnie uruchom aplikację:

```bash
./mvnw spring-boot:run
```

albo (Windows):

```bash
mvnw.cmd spring-boot:run
```

Backend powinien wystartować pod adresem w stylu:

* `http://localhost:8080`

## 5) Uruchomienie frontendu (React/Vite, venus)

W kolejnym terminalu:

```bash
cd venus
npm ci
npm run dev
```

Frontend domyślnie wystartuje pod:

* `http://localhost:5173`

---