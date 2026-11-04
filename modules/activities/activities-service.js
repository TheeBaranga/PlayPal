
import {
  colouringSheets,
  crafts,
  workshops
} from "./activities-data.js";

// COLOURING CORNER

export function getColouringSheets() {
  return colouringSheets;
}

export function getColouringSheetById(id) {
  return colouringSheets.find(sheet => sheet.id === id) ?? null;
}

// DIY CRAFTS

export function getCrafts() {
  return crafts;
}

export function getCraftById(id) {
  return crafts.find(craft => craft.id === id) ?? null;
}

export function getCraftStep(craftId, stepIndex) {
  const craft = getCraftById(craftId);

  if (!craft || !Number.isInteger(stepIndex)) {
    return null;
  }

  if (stepIndex < 0 || stepIndex >= craft.steps.length) {
    return null;
  }

  return {
    ...craft.steps[stepIndex],
    stepNumber: stepIndex + 1,
    totalSteps: craft.steps.length,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === craft.steps.length - 1
  };
}

// CREATIVE WORKSHOPS

export function getWorkshops() {
  return workshops;
}

export function getWorkshopById(id) {
  return workshops.find(workshop => workshop.id === id) ?? null;
}

export function getAvailableWorkshops() {
  return workshops.filter(workshop => workshop.availableSpots > 0);
}

// Demo booking only: no real reservation or payment.
export function requestWorkshopBooking(workshopId) {
  const workshop = getWorkshopById(workshopId);

  if (!workshop) {
    return {
      success: false,
      message: "Workshop not found."
    };
  }

  if (workshop.availableSpots <= 0) {
    return {
      success: false,
      message: "Sorry, this workshop is fully booked."
    };
  }

  return {
    success: true,
    workshopId: workshop.id,
    message:
      "This is a demo booking. Ask a grown-up to help you book a real workshop."
  };
}
