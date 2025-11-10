export const CONFIG = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingSide: 5,
  gap: 5,
  spawnOffset: -50,
  removeDelay: 850,
  tumbleDelay: 200,
};

export const gameState = {
  columns: document.querySelectorAll(".col"),
  spinButton: document.querySelector("#spin-button"),
  spinButtonIcon: document.querySelector("#spin-button-icon"),
  autoplayButton: document.querySelector("#autoplay-button"),
  autoplayEnabled: false,
  autoplayCount: 0,
  balance: 1000,
  betAmount: 10,
  winMultiplier: 0,
  layout: [],
  winningSymbols: [],
};
