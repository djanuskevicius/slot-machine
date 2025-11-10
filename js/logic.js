import { symbols, generateColumns } from "./symbols.js";
import { wait } from "./utils.js";
import { createExplosion } from "./effects.js";
import { gameState } from "./state.js";
import { updateBalance, updateLastWin } from "./dom.js";

// Main win-checking function: scans columns for consecutive symbols and triggers tumble/bonus logic

export const checkWins = async (startSpin) => {
  let { columns, spinButton, spinButtonIcon } = gameState;
  console.log("checking wins");
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
    console.log(gameState.winningSymbols);

    calculateWinMultiplier();
    await wait(1000);
    tumble(startSpin);
  } else if (gameState.autoplayEnabled) {
    console.log("no wins");
    setTimeout(() => {
      if (gameState.autoplayEnabled) {
        if (gameState.autoplayCount > 0) {
          gameState.autoplayCount--;
          console.log(`Autoplay spins left: ${gameState.autoplayCount}`);

          calculateWinnings();
          startSpin();
        } else {
          calculateWinnings();
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
  console.log("tumbling");
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
      console.log("removing matches");

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
  console.log(`Win Multiplier: ${gameState.winMultiplier}`);
};

const calculateWinnings = () => {
  const { betAmount, winMultiplier } = gameState;
  console.log(
    `Calculating winnings with bet amount: $${betAmount} and win multiplier: ${winMultiplier}`
  );
  const winnings = betAmount * winMultiplier;
  updateBalance(winnings, "add");
  updateLastWin(winnings);
  console.log(`Winnings: $${winnings}`);
  gameState.winMultiplier = 0; // Reset multiplier after payout
};

const autoplay = (startSpin) => {
  if (gameState.autoplayCount > 0) {
    gameState.autoplayCount--;
    console.log(`Autoplay spins left: ${gameState.autoplayCount}`);

    calculateWinnings();
    startSpin();
  } else {
    gameState.autoplayEnabled = false;
    console.log("Autoplay finished");
  }
};
