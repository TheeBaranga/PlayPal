
import {
  getColouringSheets,
  getCrafts,
  getCraftStep,
  getWorkshops,
  requestWorkshopBooking
} from "./activities-service.js";

// COLOURING CORNER

function renderColouringSheets() {
  const grid = document.getElementById("colouring-grid");
  if (!grid) return;

  grid.innerHTML = getColouringSheets().map(sheet => `
    <article class="activities-colouring-card">
            
        ${sheet.image
        ? `<img
            src="./${sheet.image}"
            alt="${sheet.title} colouring sheet"
            loading="lazy"
            >`
        : `<div class="activities-image-placeholder" aria-hidden="true"></div>`
        }


      <div class="activities-card-body">
        <h3>${sheet.title}</h3>
        <p>${sheet.description}</p>

        <a
          class="activities-button activities-button-primary"
          href="${sheet.download}"
          download
        >
          Download PDF
        </a>
      </div>
    </article>
  `).join("");
}

// DIY CRAFTS

let currentStepIndex = 0;
const craftId = "paper-star-lantern";

function renderCraft() {
  const craft = getCrafts().find(item => item.id === craftId);
  if (!craft) return;

  document.getElementById("craft-title").textContent = craft.title;
  document.getElementById("craft-duration").textContent =
    `${craft.duration} minutes`;
  document.getElementById("craft-difficulty").textContent = craft.difficulty;
  document.getElementById("craft-age").textContent =
    `Ages ${craft.minimumAge}+`;

  document.getElementById("craft-materials").innerHTML =
    craft.materials.map(material => `<li>${material}</li>`).join("");

  updateCraftStep();
}

function updateCraftStep() {
  const step = getCraftStep(craftId, currentStepIndex);
  if (!step) return;

  document.getElementById("craft-step-counter").textContent =
    `Step ${step.stepNumber} of ${step.totalSteps}`;

  document.getElementById("craft-step-title").textContent = step.title;
  document.getElementById("craft-step-description").textContent =
    step.instruction;

  const backButton = document.getElementById("craft-back");
  const nextButton = document.getElementById("craft-next");

  backButton.disabled = step.isFirstStep;
  nextButton.textContent = step.isLastStep ? "Start again" : "Next step";

  const craft = getCrafts().find(item => item.id === craftId);

  
document.getElementById("craft-step-indicators").innerHTML =
  craft.steps.map((item, index) => `
    <div class="activities-step-indicator
      ${index === currentStepIndex ? "is-active" : ""}
      ${index < currentStepIndex ? "is-complete" : ""}">

      <span class="activities-step-number">
        ${index < currentStepIndex ? "✓" : index + 1}
      </span>

      <span class="activities-step-label">
        ${item.title}
      </span>

    </div>
  `).join("");

}

function setupCraftNavigation() {
  document.getElementById("craft-back").addEventListener("click", () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateCraftStep();
    }
  });

  document.getElementById("craft-next").addEventListener("click", () => {
    const craft = getCrafts().find(item => item.id === craftId);

    if (currentStepIndex < craft.steps.length - 1) {
      currentStepIndex++;
    } else {
      currentStepIndex = 0;
    }

    updateCraftStep();
  });
}

// CREATIVE WORKSHOPS

function renderWorkshops() {
  const grid = document.getElementById("workshops-grid");
  if (!grid) return;

  grid.innerHTML = getWorkshops().map(workshop => `
    <article class="activities-workshop-card">
           
        ${workshop.image
        ? `<img
            src="./${workshop.image}"
            alt="${workshop.title} workshop"
            loading="lazy"
            >`
        : `<div class="activities-image-placeholder" aria-hidden="true"></div>`
        }

      <div class="activities-card-body">
        <h3>${workshop.title}</h3>

        <div class="activities-workshop-meta">
          <span>${formatDate(workshop.date)}</span>
          <span>${workshop.time}</span>
          <span>Ages ${workshop.ageRange}</span>
          <span>${workshop.availableSpots} spots left</span>
        </div>

        <p class="activities-workshop-price">
          KSh ${workshop.price.toLocaleString("en-KE")}
        </p>

        <button
          type="button"
          class="activities-button activities-button-primary"
          data-book-workshop="${workshop.id}"
          ${workshop.availableSpots <= 0 ? "disabled" : ""}
        >
          ${workshop.availableSpots > 0 ? "Book a spot" : "Fully booked"}
        </button>
      </div>
    </article>
  `).join("");
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function setupWorkshopBooking() {
  const grid = document.getElementById("workshops-grid");
  const feedback = document.getElementById("activities-feedback");

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-book-workshop]");
    if (!button) return;

    const workshopId = button.dataset.bookWorkshop;
    const result = requestWorkshopBooking(workshopId);

    feedback.textContent = result.message;
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// INITIALIZE ACTIVITIES

function initActivities() {
  renderColouringSheets();
  renderCraft();
  setupCraftNavigation();
  renderWorkshops();
  setupWorkshopBooking();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActivities);
} else {
  initActivities();
}
