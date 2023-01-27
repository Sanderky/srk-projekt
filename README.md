# System rejestracji klientów [WIP]

Projekt zaliczeniowy Inżynieria oprogramowania.

## Najważniejsze informacje

Link do Trello: [PYK](https://trello.com/projektinynieraiaoprogramowania)

Link do Figmy: [PYK](https://www.figma.com/file/Vjsph7n1hasTuwlSo9PbST/System-rejestracji-i-kolejkowania?node-id=116%3A369)

Aplikacja pisana zgodnie z modelem MVC - dużo tutoriali na YT i bardziej czytelny kod.
Piszemy w TypeScript.

Stack technologiczny **MERN**:

- MongoDB
- Express
- React
- NodeJS

- ### Workflow:

Pracujemy każdy osobno na branchu lub na wspólnych w celu ułatwienia pracy i uniknięcia konfliktów. Przed rozpoczęciem pracy należy zaktualizować projekt. Zapobiegnie to potencjalnej dużej ilości błędów.
Pamiętamy, że drobne zmiany typu literówki i inne drobne poprawki w ostatnim commicie można _amendować_ zamiast dodawać
jako nowy commit (`git commit --amend`).

Po wprowadzeniu zmian i uznaniu, że dana fukcjonalność działa należy utworzyć pull requesta do brancha `unstable` i tam
zmergować zmiany. Po naprawie ewentualnych błędów i konfilktów wspólnie mergujemy do mastera.

- ### Polityka commitów

Commity opisywane po polsku, razem z krótkim, ale dokładnym opisem zmian i z flagami.

Flagi:\
`[B]` - Bugfix\
`[N]` - New feature\
`[I]` - Improvement\
`[R]` - Rework

## Uruchomienie w środowisku testowym

### Konfiguracja

W celu prawidłowego funkcjonowania serwera konieczne jest utworzenie w katalogu `api` pliku `.env`. Może on zawierać
wrażliwe dane (URL bazy danych, hasła, klucze prywatne potrzebne do szyfrowania itp.), których nie chcemy pushować
publicznie do repo. Przykładowa zawartość pliku konieczna do prawidowego działania:

```
MONGO_USERNAME=user
MONGO_PASSWORD=examplepassword
SERVER_PORT=3000
```

Cluster w MongoDB dostępny zdalnie został utworzony przez Core-JR na jego koncie. W celu uzyskania hasła należy się do
niego zgłosić.

### Uruchomienie

W katalogu głównym skonfigurowane zostały skrypty umożliwiające szybką instalację projektu oraz szybkie uruchomienie jednocześnie backendu i frontendu. Uruchamiane są za pomocą poleceń.

- `npm run install` - skrypt, ktory wykonuje polecenie `npm install` w katalogu _api_ oraz w katalogu _frontend_ jednocześnie.

- `npm run devstart` - skrypt umożliwiający jednoczesne uruchomienie frontendu i backendu. W katalogu _api_ uruchamiany jest polecenie `npm run serve`, a w katalogu _frontend_ `npm start`.

Frontend działa na porcie `:3000`, a backend na `:4000`.

### Informacje o działaniu backendu dostępne w pliku `README.md` w katalogu `api`.

### Informacje o działaniu frontendu dostępne w pliku `README.md` w katalogu `frontend`.
