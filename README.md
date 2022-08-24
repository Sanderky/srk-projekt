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

Każdy pracuje na swoim branchu. Przed rozpoczęciem pracy robi pulla z mastera. Commitować można u siebie dowoli
oznaczając commity zgodnie z polityką, byle po mergu do mastera szło się połapać sensownie co zostało zrobione.
Pamiętamy, że drobne zmiany typu literówki i inne drobne poprawki w ostatnim commicie można _amendować_ zamiast dodawać
jako nowy commit (`git commit --amend`).

Po wprowadzeniu zmian i uznaniu, że dana fukcjonalność działa należy utworzyć pull requesta do brancha `unstable` i tam
zmergować zmiany. Po naprawie ewentualnych błędów i konfilktów wspólnie mergujemy do mastera.

- ### Polityka commitów

Commity opisujemy po polsku, razem z krótkim, ale dokładnym opisem zmian i z flagami.

Flagi:\
`[B]` - Bugfix\
`[N]` - New feature\
`[I]` - Improvement

## Uruchomienie w środowisku testowym

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

### Informacje o działaniu backendu dostępne w pliku `README.md` w katalogu `api`.