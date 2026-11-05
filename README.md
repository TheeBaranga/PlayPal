# PlayPal

A static website with a toy catalogue, three browser games, colouring downloads, craft instructions and demo workshop bookings.

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm start
```

Open http://localhost:3000. Use an HTTP server because the activities and navigation use JavaScript modules. Set `PORT` to change the default port. No dependencies need installing.

## Checks

```sh
npm test
```

Checks cover local HTML links, activity assets, PDF signatures, and Memory Match restart and size-change behaviour in both game implementations.

## Structure

- `index.html`, `shop.html`, `games.html`, `activities.html`: main pages.
- `css/` and `js/main.js`: shared styling, navigation and footer.
- `modules/activities/`: activity data, rendering and demo booking service.
- `modules/games/`: reusable games module and standalone demo.
- `assets/downloads/colouring/`: printable A4 colouring PDFs.
- `photos/`: catalogue photography.

The shop is a sample catalogue without checkout. Workshop bookings display demo feedback and do not reserve places or take payment.
