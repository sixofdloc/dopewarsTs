import { Player } from './player'; // or wherever you put the Player interface

export interface GameState {
  player: Player;
  hasDrug: number[];      // Whether each drug is available
  drugPrices: number[];   // Price of each drug in the current location
  priceNumber: number[];  // Selection number for the user
}
