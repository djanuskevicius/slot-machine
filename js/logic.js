import { symbols, generateColumns } from "./symbols.js";
import { wait } from "./utils.js";
import { createExplosion } from "./effects.js";
import { gameState } from "./state.js";
import { updateBalance, updateLastWin, updateAutoplayVisual } from "./dom.js";

// Main win-checking function: scans columns for consecutive symbols and triggers tumble/bonus logic

export const checkWins = async (startSpin) => {
  let { columns, spinButton, spinButtonIcon } = gameState;
  gameState.winningSymbols = [];

  symbols.forEach((symbol) => {
    let consecutiveCount = 0;
    let bonusCount = 0;

    for (let col = 0; col < columns.length; col++) {
      const columnSymbols = [...columns[col].children].map(
        (s) => s.dataset.symbolType
      );
      if (columnSymbols.includes(symbol)) {
        if (symbol == "🍀") {
          bonusCount++;
        }
        consecutiveCount++;
      } else {
        break;
      }
    }

    if (consecutiveCount >= 3) {
      if (bonusCount >= 3) {
        console.log(`Bonus win with ${symbol} in ${bonusCount} columns!`);
      }
      let lastColIndex = consecutiveCount - 1;
      gameState.winningSymbols.push([symbol, lastColIndex]);
    }
  });

  if (gameState.winningSymbols.length !== 0) {
    calculateWinMultiplier();
    await wait(1000);
    tumble(startSpin);
  } else if (gameState.autoplayEnabled) {
    setTimeout(() => {
      if (gameState.autoplayEnabled) {
        if (gameState.autoplayCount > 1) {
          calculateWinnings();
          startSpin();
        } else {
          calculateWinnings();
          gameState.autoplayEnabled = false;
          updateAutoplayVisual();
          spinButton.disabled = false;
          spinButton.classList.remove("spinning");
          spinButtonIcon.classList.remove("fa-spin");
        }
      }
    }, 1000);
  } else {
    calculateWinnings();
    spinButton.disabled = false;
    spinButton.classList.remove("spinning");
    spinButtonIcon.classList.remove("fa-spin");
  }
};

const tumble = async (startSpin) => {
  let { winningSymbols } = gameState;
  const allMatches = [];

  for (let i = 0; i < winningSymbols.length; i++) {
    for (let j = 0; j < winningSymbols[i][1] + 1; j++) {
      const matches = gameState.columns[j].querySelectorAll(
        `div[data-symbol-type="${winningSymbols[i][0]}"]`
      );
      allMatches.push(...matches);
    }
  }

  await Promise.all(
    allMatches.map(async (match, iteration) => {
      createExplosion(match.getBoundingClientRect());
      match.classList.add("removing");

      await wait(850);

      match.remove();
    })
  );

  await wait(200);
  generateColumns();
  await wait(350);
  checkWins(startSpin);
};

const calculateWinMultiplier = () => {
  const { winningSymbols, winMultiplier } = gameState;
  let multiplier = winMultiplier;

  winningSymbols.forEach(([symbol, lastColIndex]) => {
    const symbolCount = lastColIndex + 1;
    multiplier += symbolCount * (symbols.indexOf(symbol) + 1);
  });

  gameState.winMultiplier = multiplier;
};

const calculateWinnings = () => {
  const { betAmount, winMultiplier } = gameState;
  const winnings = betAmount * winMultiplier;
  updateBalance(winnings, "add");
  updateLastWin(winnings);
  gameState.winMultiplier = 0; // Reset multiplier after payout
};
