// src/game.ts
import { Comm } from './utils/comm';
import { Travel } from './travel';
import {GameState} from './gameState';
import { Player } from './player';
import { drugNames,locationNames } from './data';

export class Game {
  private playerName = '';
  private gameState: GameState = this.initializeGameState();
  private travel: Travel;
  constructor(private comm: Comm) {
    this.travel = new Travel(comm, this.gameState);
  }

  /**
   * Starts the game: prints intro, gets player name, then enters main loop
   */
  async start(): Promise<void> {
    // Welcome banner
    this.comm.writeLine('{clear}{white}Welcome to DopeWars v4.20!');

    // Prompt for name
    this.playerName = await this.comm.question('Enter your name: ');
    this.comm.writeLine(`{yellow}Hello, {white}${this.playerName}{reset}`);
    await this.Intro();
    this.comm.writeLine("");
    // Enter the main menu loop
    await this.mainLoop();
  }

  initializeGameState(): GameState {
    const player: Player = {
      name: '',
      currentLocation: 0,
      cash: 2000,
      debt: 2000,
      day: 1,
      bank: 0,
      capacity: 100,
      health: 100,
      bitches: 0,
      totalCarried: 0,
      carryLeft: 100,
      guns: 0,
      drugCounts: Array(12).fill(0), 
      drugAveragePrices: Array(12).fill(0), 
    };
  
    return {
      player,
      hasDrug: Array(12).fill(0),
      drugPrices: Array(12).fill(0),
      priceNumber: Array(12).fill(99),
    };
  }

  async Intro(): Promise<void> {
    const introLines = [
        '{clear}{red}           DopeWars {yellow}v4.20{white}JS',
        " ",
        '          {yellow}By {white}Six of Style{yellow}, 2015',
        " ",
        "  {yellow}With suggestions from:",
        "  {white}Dr. GPT, Digital Street Pharmacologist",
        "  {white}(this is how it asked to be credited)",
        " ",
        "{orange}Based on 'Drug Wars' By John E. Dell",
        " ",
        '{blue}This is a game of buying, selling, and fighting. The object of the game is to',
        '{cyan}pay off your debt to the loan shark, then, make as much money as you can',
        '{green}in 90 days. If you deal too heavily in drugs,  you  might  run  into  the',
        '{cyan}police!!  Your main drug stash will be in the Bronx. (fta was here)',
        "{blue}(It's a nice neighborhood)!",
        " "
      ];
      for (const line of introLines) {
        this.comm.writeLine(line);
      }
      await this.comm.getAnyKey();
    }

  /**
   * Main menu loop: Buy, Sell, Travel, Quit
   */
  private async mainLoop(): Promise<void> {
    //Initial travel to Bronx
    await this.travel.travelToLocation();
    while (true) {
      await this.DrawMainDisplay();
      this.comm.writeLine('');
      this.comm.writeLine('{white}[B]uy   [S]ell   [T]ravel   [Q]uit{reset}');
      this.comm.write('{yellow}Choice: {reset}');

      const ch = (await this.comm.getChar(false,true) || '').toUpperCase();
      this.comm.writeLine('');

      switch (ch) {
        case 'B':
          await this.buy();
          break;
        case 'S':
          await this.sell();
          break;
        case 'T':
          await this.DoTravel();
          break;
        case 'Q':
          this.comm.writeLine('{white}Goodbye!{reset}');
          this.comm.close();
          return;
        default:
          this.comm.writeLine('{red}Invalid choice. Please select B, S, T, or Q.{reset}');
      }
    }
  }

  private async DrawMainDisplay(): Promise<void> {
    const { player } = this.gameState;
    const { hasDrug, drugPrices } = this.gameState;
  
    this.comm.writeLine('{white}{clear}');
    this.comm.drawDivider();
    this.comm.writeLine(`{white}Location: {red}${locationNames[player.currentLocation]}`);
    this.comm.writeLine(`{yellow}Cash: {green}$${player.cash}  {yellow}Debt: {green}$${player.debt}`);
    this.comm.writeLine(`{yellow}Bank: {green}$${player.bank}  {yellow}Health: {green}${player.health}%`);
    this.comm.writeLine(`{yellow}Bitches: ${player.bitches}  Guns: ${player.guns}  Carry: ${player.carryLeft}/${player.capacity}`);
    this.comm.write('{white}');
    this.comm.drawDivider();
  
    // Headers                         0123456789012345678901234567890123456789
    this.comm.writeLine('{revson}{blue}Name      Price     Qty       Paid      {revsoff}{white}');
    this.comm.drawDivider();
  
    for (let i = 0; i < drugNames.length; i++) {
      const name = drugNames[i].padEnd(10);;
      const price = hasDrug[i] ? drugPrices[i].toString().padEnd(10) : '';
      const qty = player.drugCounts[i] > 0 ? player.drugCounts[i].toString().padEnd(10) : '';
      const paid = player.drugCounts[i] > 0 ? player.drugAveragePrices[i].toString().padEnd(10) : '';
  
      // Only print if it's available or carried
      if (hasDrug[i] || player.drugCounts[i]) {
        this.comm.writeLine(
          `{white}${name}{green}${price}  ` +
          `{yellow}${qty}{cyan}${paid}`
        );
      }
    }
  
    this.comm.write('{white}');
    this.comm.drawDivider();
  }
  
  private async buy(): Promise<void> {
    const { player, hasDrug, drugPrices, priceNumber } = this.gameState;
  
    this.comm.writeLine('{cyan}== Buy Drugs =={reset}');
    this.comm.writeLine('');
    await this.listBuyOptions();
    const input = await this.comm.question('{white}Buy what? {yellow}');
    const selection = parseInt(input);
    if (!selection) return this.comm.writeLine('{red}Invalid selection.{reset}');
  
    let whichDrug = -1;
    for (let i = 0; i < priceNumber.length; i++) {
      if (selection === priceNumber[i]) {
        whichDrug = i;
        break;
      }
    }
  
    if (whichDrug === -1 || !hasDrug[whichDrug]) {
      this.comm.writeLine("{red}That's not for sale here!{reset}");
      return;
    }
  
    const maxBuyable = Math.floor(player.cash / drugPrices[whichDrug]);
    this.comm.writeLine(`{white}You can afford {green}${maxBuyable}{white} units.`);
    const qtyInput = await this.comm.question('{white}Buy how many? {yellow}');
    const quantity = parseInt(qtyInput);
    if (!quantity) return;
  
    const totalCost = quantity * drugPrices[whichDrug];
    if (totalCost > player.cash) {
      this.comm.writeLine("{red}You can't afford that many.{reset}");
      return;
    }
  
    if (quantity > player.carryLeft) {
      this.comm.writeLine("{red}You can't carry that much!{reset}");
      return;
    }
  
    const currentQty = player.drugCounts[whichDrug];
    if (currentQty > 0) {
      const oldAvg = player.drugAveragePrices[whichDrug];
      player.drugAveragePrices[whichDrug] = Math.floor(
        (oldAvg * currentQty + quantity * drugPrices[whichDrug]) /
        (currentQty + quantity)
      );
    } else {
      player.drugAveragePrices[whichDrug] = drugPrices[whichDrug];
    }
  
    player.cash -= totalCost;
    player.drugCounts[whichDrug] += quantity;
    player.carryLeft -= quantity;
  
    this.comm.writeLine(`{cyan}Purchased ${quantity} units of ${drugNames[whichDrug]}{reset}`);
    await this.comm.pause();
  }
  
  /**
   * Handles the Sell Drugs action
   */
  private async sell(): Promise<void> {
    const { player, hasDrug, drugPrices, priceNumber } = this.gameState;
  
    this.comm.writeLine('{cyan}== Sell Drugs =={reset}');
    this.comm.writeLine('');
  
    const hasInventory = player.drugCounts.some(count => count > 0);
    if (!hasInventory) {
      this.comm.writeLine("{red}You don't have shit to sell!{reset}");
      await this.comm.pause();
      return;
    }
  
    await this.listSellOptions();
    const input = await this.comm.question('{white}Sell what? {yellow}');
    const selection = parseInt(input);
    if (!selection) return this.comm.writeLine('{red}Invalid selection.{reset}');
  
    let whichDrug = -1;
    for (let i = 0; i < priceNumber.length; i++) {
      if (selection === priceNumber[i]) {
        whichDrug = i;
        break;
      }
    }
  
    if (whichDrug === -1 || !hasDrug[whichDrug]) {
      this.comm.writeLine("{red}No buyers for that here!{reset}");
      await this.comm.pause();
      return;
    }
  
    const qtyInput = await this.comm.question('{white}How many units? {yellow}');
    const quantity = parseInt(qtyInput);
    if (!quantity || quantity > player.drugCounts[whichDrug]) {
      this.comm.writeLine("{red}You don't have that many!{reset}");
      return;
    }
  
    const total = quantity * drugPrices[whichDrug];
    player.cash += total;
    player.drugCounts[whichDrug] -= quantity;
    player.carryLeft += quantity;
  
    this.comm.writeLine(`{cyan}Sold ${quantity} units of ${drugNames[whichDrug]}{reset}`);
    await this.comm.pause();
  }

  /** Stub for traveling */
  private async DoTravel(): Promise<void> {
    this.comm.writeLine('{cyan}== Travel =={reset}');
    await this.ListLocations();
    this.comm.writeLine('{white}Travel to:{yellow}');
    const locationInput = await this.comm.getChar(false, true);
    const locationIndex = parseInt(locationInput, 10) - 1;
    if (isNaN(locationIndex) || locationIndex < 0 || locationIndex >= locationNames.length) {
      this.comm.writeLine('{red}Invalid location. Please try again.{reset}');
      return;
    }
    this.gameState.player.currentLocation = locationIndex;
    this.comm.writeLine(`{white}Traveling to {blue}${locationNames[locationIndex]}...`);
    // Simulate travel time by pausing for a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.travel.travelToLocation();
  }
  private async ListLocations(): Promise<void> {
    const current = this.gameState.player.currentLocation;
    for (let i = 0; i < locationNames.length; i++) {
      if (i === current) {
        this.comm.writeLine(`{white}${i + 1}. {blue}${locationNames[i]}{white} <- Current Location`);
      } else {
        this.comm.writeLine(`{white}${i + 1}. {blue}${locationNames[i]}`);
      }
    }
  }
  private listBuyOptions(): void {
    const { hasDrug, drugPrices } = this.gameState;
    const { priceNumber } = this.gameState;
    for (let i = 0; i < drugNames.length; i++) {
      if (hasDrug[i]) {
        this.comm.writeLine(`{white}${priceNumber[i]}. {blue}${drugNames[i]}    {green}$${drugPrices[i]}`);
      }
    }
  }

  private listSellOptions(): void {
    const { player } = this.gameState;
    const { priceNumber } = this.gameState;
    let index = 1;
    for (let i = 0; i < drugNames.length; i++) {
      priceNumber[i] = 99;
    }
    for (let i = 0; i < drugNames.length; i++) {
      if (player.drugCounts[i] > 0) {
        this.comm.writeLine(`{white}${index}. {blue}${drugNames[i]}  {green}${player.drugCounts[i]}`);
        priceNumber[i] = index++;
      }
    }
  }
}
