
export const colouringSheets = [
  {
    id: "space-explorer",
    title: "Space Explorer",
    description: "Free · PDF · A4 paper",
    image: "assets/images/activities/colouring/colouring-explorer.png",
    download: "assets/downloads/colouring/space-explorer.pdf"
  },
  {
    id: "lab-day",
    title: "Lab Day",
    description: "Free · PDF · A4 paper",
    image: "assets/images/activities/colouring/colouring-lab.png",
    download: "assets/downloads/colouring/lab-day.pdf"
  },
  {
    id: "castle-time",
    title: "Castle Time",
    description: "Free · PDF · A4 paper",
    image: "assets/images/activities/colouring/colouring-castle.png",
    download: "assets/downloads/colouring/castle-time.pdf"
  },
  {
    id: "paint-party",
    title: "Paint Party",
    description: "Free · PDF · A4 paper",
    image: "assets/images/activities/colouring/colouring-mandala.png",
    download: "assets/downloads/colouring/paint-party.pdf"
  }
];

export const crafts = [
  {
    id: "paper-star-lantern",
    title: "Paper Star Lantern",
    duration: 20,
    difficulty: "Easy",
    minimumAge: 8,
    materials: ["Paper", "Scissors", "Glue", "Ruler"],
    steps: [
      {
        title: "Pick paper",
        heading: "Pick your paper",
        instruction: "Choose a sheet of paper for your lantern."
      },
      {
        title: "Fold",
        heading: "Fold the paper",
        instruction:
          "Fold your paper in half, like closing a book. Press along the fold with your finger to make it flat and neat."
      },
      {
        title: "Cut",
        heading: "Cut the folded paper",
        instruction: "Keep the fold at the bottom. Cut evenly spaced slits up from the fold, stopping before the top edge. Ask a grown-up for help with scissors."
      },
      {
        title: "Glue",
        heading: "Glue your lantern",
        instruction: "Unfold the paper. Bring the two short edges together to make a tube, overlap them and glue them in place. Let the glue dry."
      },
      {
        title: "Shine",
        heading: "Decorate and shine",
        instruction: "Show off your finished lantern. Use an LED light only, never a candle."
      }
    ]
  }
];

export const workshops = [
  {
    id: "junior-painters",
    title: "Junior Painters Studio",
    date: "2026-11-14",
    time: "10:00 – 11:30",
    ageRange: "8–12",
    availableSpots: 8,
    price: 1500,
    currency: "KES"
  },
  {
    id: "robot-builders",
    title: "Robot Builders Lab",
    date: "2026-11-21",
    time: "10:00 – 12:00",
    ageRange: "8–12",
    availableSpots: 3,
    price: 2000,
    currency: "KES",
    image: "assets/images/activities/workshops/workshop-robots.png"
  },
  {
    id: "comic-book-makers",
    title: "Comic Book Makers",
    date: "2026-11-28",
    time: "14:00 – 15:30",
    ageRange: "8–12",
    availableSpots: 12,
    price: 1200,
    currency: "KES",
    image: "assets/images/activities/workshops/workshop-comics.png"
  }
];
