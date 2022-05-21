// ****Input****
const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const titleEL = document.getElementById("title");
const dateEl = document.getElementById("date-picker");
// ****Countdown****
const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const timeElements = document.querySelectorAll("span");
const countdownBtn = document.getElementById("countdown-button");
// ****Complete****
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");
// Time variables
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
// Set minimal calendar day to be equal to Today's Day.
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Set countdown variables.
let countdownActive;
let countdownValue = new Date();
let countdownTitle = "";
let countdownDate = "";
// Variable to be saved in localStorage.
let savedCountdown;

// Populate Countdown / Complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    // hide Input Container
    inputContainer.hidden = true;
    // If the countdown has ended, show complete container.
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Show the coundown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

function updateCountdown(e) {
  e.preventDefault();
  // Set title and date, save to localStorage
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  // Save date and title to local storage.
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  // Check if no date entered
  if (countdownDate === "") {
    alert("Please select a date for the countdown.");
  } else {
    // Get UTC offset Time. Countdown will end counting in 00:00.
    const utcOffsetTime = new Date(countdownDate).getTimezoneOffset() * minute;
    // Convert countdown date to milliseconds
    countdownValue = new Date(countdownDate).getTime() + utcOffsetTime;
    updateDOM();
  }
}

function reset() {
  // Hide countdowns, show inpu form
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // Stop the countdown
  clearInterval(countdownActive);
  // Reset values, remove localStorage item.
  countdownTitle = "";
  countdownDate = "";
  dateEl.value = "";
  titleEL.value = "";
  localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
  // Get countdown from localStorage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    // Retrieve date and title from local storage.
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    // Populate countdown container with title and date
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    // Set countdown value and update the DOM.
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listenrs
// Update time each second
countdownForm.addEventListener("submit", updateCountdown);
// Reset countdown and filled form
completeBtn.addEventListener("click", reset);
// Reset countdown and filled form
countdownBtn.addEventListener("click", reset);
// Load countdown date from localStorage and display countdown container
window.addEventListener("load", restorePreviousCountdown);
