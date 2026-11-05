
import {
  getColouringSheets,
  getCrafts,
  getCraftStep,
  getWorkshops,
  requestWorkshopBooking
} from "./activities-service.js";

// Data paths are site-relative, not relative to the page that renders them.
const assetUrl = path => new URL(`../../${path}`, import.meta.url).href;

// COLOURING CORNER

function renderColouringSheets() {
  const grid = document.getElementById("colouring-grid");
  if (!grid) return;

  grid.innerHTML = getColouringSheets().map(sheet => `
    <article class="activities-colouring-card">
            
        ${sheet.image
        ? `<img
            src="${assetUrl(sheet.image)}"
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
          href="${assetUrl(sheet.download)}"
          download
          aria-label="Download ${sheet.title} colouring sheet (PDF)"
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

  document.getElementById("craft-step-title").textContent = step.heading ?? step.title;
  document.getElementById("craft-step-description").textContent =
    step.instruction;

  const backButton = document.getElementById("craft-back");

  backButton.disabled = step.isFirstStep;
  document.getElementById("craft-next-label").textContent =
    step.isLastStep ? "Start again" : "Next step";

  const craft = getCrafts().find(item => item.id === craftId);


  document.getElementById("craft-step-indicators").innerHTML =
    craft.steps.map((item, index) => `
      <li class="activities-step-indicator
        ${index === currentStepIndex ? "is-active" : ""}
        ${index < currentStepIndex ? "is-complete" : ""}"
        ${index === currentStepIndex ? 'aria-current="step"' : ''}>
        <span class="activities-step-number" aria-hidden="true">
          ${index < currentStepIndex
            ? '<img src="../../assets/images/activities/crafts/check.svg" alt="" width="22" height="22">'
            : index + 1}
        </span>
        <span class="activities-step-label">
          <span class="activities-sr-only">Step ${index + 1}: </span>${item.title}
          ${index < currentStepIndex ? '<span class="activities-sr-only"> (completed)</span>' : ''}
        </span>
      </li>
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
            src="${assetUrl(workshop.image)}"
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
          aria-label="Book a spot for ${workshop.title}"
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
    feedback.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest"
    });
  });
}

// Handle failed image requests as well as missing image paths.
function setupImageFallbacks() {
  document.querySelectorAll("#main-content img").forEach(image => {
    // Decorative icons remain decorative; only content images need a placeholder.
    if (!image.alt) return;
    const showPlaceholder = () => {
      const placeholder = document.createElement("div");
      placeholder.className = "activities-image-placeholder";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", `${image.alt} - image unavailable`);
      if (image.classList.contains("activities-craft-image")) {
        placeholder.classList.add("activities-craft-image");
      }
      image.replaceWith(placeholder);
    };
    image.addEventListener("error", showPlaceholder, { once: true });
    if (image.complete && image.naturalWidth === 0) showPlaceholder();
  });
}

// INITIALIZE ACTIVITIES

function initActivities() {
  renderColouringSheets();
  renderCraft();
  setupCraftNavigation();
  renderWorkshops();
  setupWorkshopBooking();
  setupImageFallbacks();
  if (new URLSearchParams(window.location.search).get("section") === "workshops") {
    document.getElementById("workshops").scrollIntoView({ block: "start" });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActivities);
} else {
  initActivities();
}
