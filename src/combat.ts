// src/combat.ts
import { Comm } from './utils/comm';
import { GameState } from './gameState';

export class Combat {
  constructor(private comm: Comm, private state: GameState) {}

  async fightCops(): Promise<boolean> {
    const { player } = this.state;

    this.comm.crlf();
    this.comm.writeLine("{red}You ran into the cops!{reset}");
    this.comm.crlf();

    let copHealth = 50 + Math.floor(Math.random() * 51); // 50–100
    let playerHealth = player.health;
    let deputies = Math.floor(Math.random() * 4); // 0–3 deputies

    while (playerHealth > 0 && copHealth > 0) {
      this.comm.writeLine(`{yellow}Your health: ${playerHealth} | Cop health: ${copHealth} | Deputies: ${deputies}`);

      // Player's turn
      const hitChance = 70;
      const playerRoll = Math.random() * 100;
      if (playerRoll < hitChance) {
        const damage = 10 + Math.floor(Math.random() * 11); // 10–20
        this.comm.writeLine(`{green}You hit the cop for ${damage}!`);
        copHealth -= damage;
      } else {
        this.comm.writeLine("{red}You missed!");
      }

      if (copHealth <= 0) {
        break;
      }

      // Cop's turn
      const copHitChance = 60;
      const copRoll = Math.random() * 100;
      if (copRoll < copHitChance) {
        const damage = 5 + Math.floor(Math.random() * 11); // 5–15
        this.comm.writeLine(`{red}The cop hits you for ${damage}!`);
        playerHealth -= damage;
      } else {
        this.comm.writeLine("{green}The cop missed you!");
      }

      if (playerHealth <= 0) {
        break;
      }

      await this.pause();
    }

    player.health = playerHealth;

    if (playerHealth <= 0) {
      this.comm.crlf();
      this.comm.writeLine("{red}You have been killed by the cops!{reset}");
      return false; // Dead
    }

    this.comm.crlf();
    this.comm.writeLine("{green}You defeated the cops!{reset}");
    return true; // Alive
  }

  private async pause(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
