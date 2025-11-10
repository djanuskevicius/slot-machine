// Bootstraps the app
import { gameState } from "./state.js";
import { generateColumns, getRandomLayout } from "./symbols.js";
import { checkWins } from "./logic.js";
import { wait } from "./utils.js";
import { updateBalance } from "./dom.js";

const { spinButton, spinButtonIcon } = gameState;

export const startSpin = async () => {
  if (gameState.betAmount > gameState.balance) {
    alert("Insufficient balance to place this bet.");
    return;
  }
  updateBalance(gameState.betAmount, "subtract");
  let currentSymbols = document.querySelectorAll(".symbol");

  spinButton.disabled = true;
  spinButton.classList.add("spinning");
  spinButtonIcon.classList.add("fa-spin");

  currentSymbols.forEach(async (symbol) => {
    symbol.style.top = `${500}px`;
    await wait(300);
    symbol.remove();
  });

  await wait(600);
  gameState.layout = getRandomLayout();
  generateColumns();
  await wait(400);
  checkWins(startSpin);
};

spinButton.addEventListener("click", startSpin);
gameState.autoplayButton.addEventListener("click", () => {
  gameState.autoplayEnabled = !gameState.autoplayEnabled;
  console.log(
    `Autoplay is now ${gameState.autoplayEnabled ? "enabled" : "disabled"}`
  );
});
