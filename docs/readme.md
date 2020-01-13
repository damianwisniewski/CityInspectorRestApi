# City Inspector Rest API

REST API

Aby umożliwić uruchomienie projektu, zakomitowałem plik ze zmiennymi środowiskowymi znajdujący się w `app/config/.env.development`.

Umożliwi on uruchamianie developerskiej wersji aplikacji, dla uruchomienia produkcyjnej, konieczne będzie stworzenie pliku: `app/config/.env.production` z analogicznymi zmiennymi środowiskowymi.

Do uruchomienia projektu, należy posiadać oczywiście zainstalowany NodeJS, a następnie zainstalować wszystkie zależności poprzez polecenie `npm install`.

Następnie należy utworzyć bazę danych za pomocą polecenia `db-sync:dev` oraz `db-fill:dev`

> Pozostałe polecenia związane z bazą danych
>
> - `db-sync` `db-sync:dev` służą do zsynchronizowania / stworzenia bazy
> - `db-fill` `db-fill:dev` służą do wypełnienia bazy losowo wygenerowanymi danymi
> - `db-sync:force` `db-sync:force:dev` służą do zresetowania dazy, jeśli chcemy zainicjować ją na nowo, czyszcząć ją przy okazji z danych.

Aby odpalić projekt, możemy to zrobić wykorzystując następujące polecenia:

- `npm start` (uruchamia produkcyjną wersje - wymagane są produkcyjne zmienne środowiskowe)
- `npm run start:dev` (uruchamia developerską wersje)

> Testy aplikacji nie zostały jeszcze do końca poprawione i skończone, ze względu na brak czasu.
