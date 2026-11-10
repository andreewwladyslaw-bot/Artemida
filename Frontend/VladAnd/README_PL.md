# EduPlatform — wersja polskojęzyczna

Projekt frontendowy React + Vite przetłumaczony z rosyjskiego na język polski.

## Co zostało przetłumaczone?

- Strona logowania (`/login`): etykiety pól, przyciski, linki, komunikaty walidacji.
- Pierwsza zmiana hasła (`/first-login`): wszystkie komunikaty, pola i przycisk kontynuowania.
- Odzyskiwanie dostępu (`/forgot-password`): strona informacyjna i link powrotu.
- Panel główny (`/dashboard`) i nagłówki pozostałych widoków.
- Błędy żądań API oraz komunikaty sprawdzania sesji.
- Opisy i oczekiwane polskie teksty w 17 testach (11 logowania + 6 zmiany hasła).
- Język dokumentu HTML ustawiono na `pl`.

**Nie zmieniono** nazw komponentów, funkcji, zmiennych ani ścieżek API, aby zachować ich działanie.

## Instalacja i uruchamianie

Zainstaluj Node.js zgodny z wersjami zależności zapisanymi w `package.json`. W terminalu VS Code:

```powershell
cd edu-platform
npm ci
npm run dev
```

Następnie otwórz adres podany przez Vite, zwykle `http://localhost:5173/login`.

## Testy

```powershell
npm run test
```

Samo istnienie 17 testów nie oznacza, że zostały uruchomione z powodzeniem w tym archiwum — uruchom je w swoim środowisku.

## Ważne informacje

- W archiwum celowo nie ma `node_modules` — zależności instalujesz poleceniem `npm ci`.
- To frontend. Aby wykonać prawdziwe logowanie i zmianę hasła, potrzebny jest backend obsługujący `/auth/login`, `/auth/me` oraz `/auth/change-initial-password`.
- Jeśli backend zwraca własny tekst w polu `message`, ten tekst może być wyświetlany bez tłumaczenia. Aby cały system był po polsku, backend również powinien zwracać polskie komunikaty lub stabilne kody błędów.
- `/forgot-password` wyświetla informację o kontakcie z administratorem; automatyczne odzyskiwanie hasła nie jest zaimplementowane.
