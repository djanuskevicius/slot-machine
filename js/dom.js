import { gameState } from "./state.js";

const balanceElement = document.querySelector("#balance");
const lastWinElement = document.querySelector("#last-win");
const betAmountElement = document.querySelector("#bet-amount");
const betAddButton = document.querySelector("#bet-add");
const betSubtractButton = document.querySelector("#bet-subtract");
const sliderEl = document.querySelector("#range");
const sliderValue = document.querySelector(".value");
const modal = document.getElementById("autoplay-modal");
const closeModal = document.getElementById("close-modal");

const allowedValues = [10, 25, 50, 75, 100, 250, 500, 1000];

let { balance, betAmount, autoplayButton, autoplayApplyButton } = gameState;

balanceElement.textContent = ` $${balance.toFixed(2)}`;
betAmountElement.textContent = `$${betAmount.toFixed(2)}`;
sliderValue.textContent = allowedValues[sliderEl.value];

export const updateBalance = (amount, operation) => {
  balance = operation === "add" ? balance + amount : balance - amount;
  gameState.balance = balance;
  balanceElement.textContent = ` $${balance.toFixed(2)}`;
};

const adjustBetAmount = (operation) => {
  if (operation === "add") {
    betAmount += 1;
  } else if (operation === "subtract" && betAmount > 1) {
    betAmount -= 1;
  }

  gameState.betAmount = betAmount;
  betAmountElement.textContent = `$${betAmount.toFixed(2)}`;
};

export const updateLastWin = (amount) => {
  lastWinElement.textContent = ` $${amount.toFixed(2)}`;
};

export const updateAutoplayVisual = () => {
  if (gameState.autoplayEnabled) {
    autoplayButton.classList.add("btn-enabled");
    autoplayButton.textContent = `AUTOPLAY (${gameState.autoplayCount})`;
  } else {
    autoplayButton.classList.remove("btn-enabled");
    autoplayButton.textContent = `AUTOPLAY`;
  }
};

betAddButton.addEventListener("click", () => {
  adjustBetAmount("add");
});
betSubtractButton.addEventListener("click", () => {
  adjustBetAmount("subtract");
});

sliderEl.addEventListener("input", (event) => {
  sliderValue.textContent = allowedValues[sliderEl.value];
  gameState.autoplayCount = allowedValues[sliderEl.value];
});

autoplayButton.addEventListener("click", () => {
  if (gameState.autoplayEnabled) {
    gameState.autoplayEnabled = false;
    gameState.autoplayCount = allowedValues[sliderEl.value];
    updateAutoplayVisual();
  } else {
    modal.style.display = "flex"; // show overlay
    setTimeout(() => modal.classList.add("show"), 10); // trigger slide-in
  }
});

autoplayButton.addEventListener("mouseenter", () => {
  if (gameState.autoplayEnabled) {
    autoplayButton.textContent = "DISABLE AUTOPLAY";
  }
});

autoplayButton.addEventListener("mouseleave", () => {
  if (gameState.autoplayEnabled) {
    autoplayButton.textContent = `AUTOPLAY (${gameState.autoplayCount})`;
  }
});

autoplayApplyButton.addEventListener("click", () => {
  gameState.autoplayEnabled = true;
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 400);

  updateAutoplayVisual();
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  setTimeout(() => (modal.style.display = "none"), 400); // wait for animation
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 400);
  }
});
