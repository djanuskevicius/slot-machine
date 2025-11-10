// Symbol definitions & randomization
import { gameState, CONFIG } from "./state.js";
export const symbols = ["🍒", "🍋", "🍇", "🍌", "🫐", "💎", "🍀"];

export const getRandomSymbol = () => {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
};

export const getRandomLayout = () => {
  const columnCount = gameState.columns.length;
  return Array.from(
    { length: columnCount },
    () => Math.floor(Math.random() * 6) + 2 // 2 to 7 symbols per column
  );
};

export const generateColumns = () => {
  const { columns, layout } = gameState;
  console.log("generating columns");
  console.log(columns);

  [...columns].forEach((col, colIndex) => {
    while (col.children.length < layout[colIndex]) {
      const symbol = getRandomSymbol();
      const symbolElement = document.createElement("div");
      symbolElement.textContent = symbol;
      symbolElement.dataset.symbolType = symbol;
      symbolElement.classList.add("symbol");
      symbolElement.style.top = `${CONFIG.spawnOffset}px`; // Adjust for spacing
      if (symbol === "🍀") {
        symbolElement.classList.add("bonus_symbol");
      }
      col.appendChild(symbolElement);
    }
    const { paddingTop } = CONFIG;
    const { paddingBottom } = CONFIG;
    const { paddingSide } = CONFIG;
    const columnHeight = col.clientHeight;
    const columnWidth = col.clientWidth;
    const symbolCount = col.children.length;
    const innerHeight = columnHeight - paddingTop - paddingBottom;
    const innerWidth = columnWidth - paddingSide * 2;
    const { gap } = CONFIG;
    const totalGaps = (symbolCount - 1) * gap;
    const symbolWidth = innerWidth;
    const symbolHeight = (innerHeight - totalGaps) / symbolCount;
    const symbols = col.querySelectorAll(".symbol");
    symbols.forEach((symbol, index) => {
      const topOffset = paddingTop + index * (symbolHeight + gap);
      symbol.style.top = `${topOffset}px`;
      symbol.style.left = `${paddingSide}px`;
      symbol.style.height = `${symbolHeight}px`;
      symbol.style.width = `${symbolWidth}px`;
    });
  });
};
