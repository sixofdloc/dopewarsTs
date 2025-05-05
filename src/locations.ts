// src/locations.ts
import { Comm } from './utils/comm'
import { GameState } from './gameState'
import { gunNames, gunPrices, gunDamages, drugNames, cursingStart, cursingEnd } from './data'

export class Locations {
  constructor(private comm: Comm, private state: GameState) {}

  async visitGunStore(): Promise<void> {
    this.comm.writeLine("{white}You enter the gun store.{newline}On the far wall, there's a giant poster");
    this.comm.writeLine("of Ted Nugent wearing a flag and {newline}fellating an eagle.");
    while (true) {
      this.comm.writeLine(`You have {green}$${this.state.player.cash}{white}.`)
      const choice = (await this.comm.question("{revson}B{revsoff}uy, {revson}S{revsoff}ell, S{revson}h{revsoff}oplift, {revson}L{revsoff}eave: {yellow}")).toUpperCase()
      if (choice === 'B') {
        this.comm.writeLine("Buy")
        gunNames.forEach((name, index) => {
          this.comm.writeLine(`${index + 1}. ${name} - $${gunPrices[index]}`)
        })
        const gunChoice = parseInt(await this.comm.question("Buy what? {yellow}")) - 1
        if (isNaN(gunChoice) || gunChoice < 0 || gunChoice >= gunNames.length) {
          this.comm.writeLine("{red}Invalid Selection")
          continue
        }
        const quantity = parseInt(await this.comm.question("How many? {yellow}"))
        if (isNaN(quantity) || quantity <= 0) continue
        const cost = quantity * gunPrices[gunChoice]
        if (cost > this.state.player.cash) {
          this.comm.writeLine("{red}You can't afford that many.")
          continue
        }
        this.state.player.cash -= cost
        this.state.player.guns += quantity
        this.comm.writeLine(`{cyan}Purchased ${quantity} ${gunNames[gunChoice]}(s)`)
      } else if (choice === 'S') {
        this.comm.writeLine("Sell")
        if (this.state.player.guns <= 0) {
          this.comm.writeLine("{red}You don't have shit to sell!")
          continue
        }
        const gunChoice = parseInt(await this.comm.question("Sell what? {yellow}")) - 1
        if (isNaN(gunChoice) || gunChoice < 0 || gunChoice >= gunNames.length) {
          this.comm.writeLine("{red}Invalid Selection")
          continue
        }
        const quantity = parseInt(await this.comm.question("How many? {yellow}"))
        if (isNaN(quantity) || quantity <= 0 || quantity > this.state.player.guns) {
          this.comm.writeLine("{red}You don't have that many!")
          continue
        }
        const resale = Math.floor(gunPrices[gunChoice] * 0.6)
        this.comm.writeLine(`{orange}Sell ${quantity} ${gunNames[gunChoice]}(s) for $${resale * quantity}? (Y/N)`)
        const confirm = (await this.comm.getChar(false, true)).toUpperCase()
        if (confirm === 'Y') {
          this.state.player.cash += resale * quantity
          this.state.player.guns -= quantity
          this.comm.writeLine(`{cyan}Sold ${quantity} ${gunNames[gunChoice]}(s)`)
        }
      } else if (choice === 'H') {
        this.comm.writeLine("Shoplift")
        const roll = Math.random() * 100
        if (roll < 30) {
          this.comm.writeLine("{red}You get caught{newline}The clerk shoots you in the ass.")
          this.state.player.health -= 20
          if (this.state.player.health <= 0) {
            this.comm.writeLine("{red}You died!")
            return
          }
        } else if (roll < 70) {
          this.comm.writeLine("{red}You get caught{newline}You manage to get away.")
        } else {
          const stealIndex = gunNames.findIndex(() => Math.random() <= 0.7)
          if (stealIndex !== -1) {
            this.state.player.guns += 1
            this.comm.writeLine(`{orange}You manage to steal a ${gunNames[stealIndex]}`)
          } else {
            this.comm.writeLine("{red}You consider shoplifting{newline}but don't risk it.")
          }
        }
      } else if (choice === 'L') {
        this.comm.writeLine("Leave")
        return
      } else {
        this.comm.writeLine("{red}Invalid Option")
      }
    }
  }

  async visitHospital(): Promise<void> {
    this.comm.writeLine("{white}You enter the hospital.{newline}It smells like chemicals.")
    while (true) {
      const healCost = (100 - this.state.player.health) * (Math.floor(Math.random() * 1000)) + 100
      this.comm.writeLine(`You have {green}$${this.state.player.cash}{white}.`)
      const choice = (await this.comm.question("{revson}D{revsoff}octor, {revson}S{revsoff}teal drugs, {revson}L{revsoff}eave: {yellow}")).toUpperCase()
      if (choice === 'D') {
        this.comm.writeLine("See Doctor{newline}")
        if (this.state.player.health === 100) {
          this.comm.writeLine("{red}You don't need a doctor, dumbass.")
          continue
        }
        this.comm.writeLine(`{white}The doctor will fix you up for {green}$${healCost}{white}. Pay (Y/N)? {yellow}`)
        const answer = (await this.comm.getChar(false, true)).toUpperCase()
        if (answer !== 'Y') continue
        if (this.state.player.cash < healCost) {
          this.comm.writeLine("{red}You don't have that much!")
          continue
        }
        this.state.player.cash -= healCost
        this.state.player.health = 100
        this.comm.writeLine("{orange}The doctor stitches you up.")
      } else if (choice === 'S') {
        this.comm.writeLine("Steal drugs{newline}")
        const roll = Math.random() * 100
        if (roll < 30) {
          this.comm.writeLine("{red}You get caught{newline}The guard shoots you in the ass.")
          this.state.player.health -= 20
          if (this.state.player.health <= 0) {
            this.comm.writeLine("{red}You died!")
            return
          }
        } else if (roll < 70) {
          this.comm.writeLine("{red}You get caught{newline}You manage to get away.")
        } else if (roll < 85) {
          if (this.state.player.carryLeft === 0) {
            this.comm.writeLine("{red}You find ludes,{newline}but can't carry any more.")
          } else {
            this.state.player.drugCounts[4] += this.state.player.carryLeft
            this.comm.writeLine(`{orange}You manage to steal ${this.state.player.carryLeft} ludes`)
            this.state.player.carryLeft = 0
          }
        } else {
          this.comm.writeLine("{red}You consider stealing{newline}but don't risk it.")
        }
      } else if (choice === 'L') {
        this.comm.writeLine("Leave")
        return
      } else {
        this.comm.writeLine("{red}Invalid Option")
      }
    }
  }

  async visitBank(): Promise<void> {
    this.comm.writeLine("{white}You enter the bank.{newline}The security guard eyes you.")
    while (true) {
      this.comm.writeLine(`{white}You have {green}$${this.state.player.bank}{white} in the bank.`)
      this.comm.writeLine(`You're carrying {green}$${this.state.player.cash}{white}.`)
      const choice = (await this.comm.question("{revson}W{revsoff}ithdraw, {revson}D{revsoff}eposit, {revson}L{revsoff}eave: {yellow}")).toUpperCase()
      if (choice === 'W') {
        const amount = parseInt(await this.comm.question("Withdraw.{newline}How much? "))
        if (isNaN(amount) || amount <= 0) continue
        if (amount > this.state.player.bank) {
          this.comm.writeLine("{red}You don't have that much!")
          continue
        }
        this.state.player.bank -= amount
        this.state.player.cash += amount
      } else if (choice === 'D') {
        const amount = parseInt(await this.comm.question("Deposit.{newline}How much? "))
        if (isNaN(amount) || amount <= 0) continue
        if (amount > this.state.player.cash) {
          this.comm.writeLine("{red}You don't have that much!")
          continue
        }
        this.state.player.cash -= amount
        this.state.player.bank += amount
      } else if (choice === 'L') {
        this.comm.writeLine("Leave")
        return
      } else {
        this.comm.writeLine("{red}Invalid Option")
      }
    }
  }

  async visitBar(): Promise<void> {
    this.comm.writeLine("{white}The neighborhood bar is dark and smoky.")
    this.comm.writeLine("You find a seat in the corner.")

    while (true) {
      this.comm.writeLine(`{white}Cash: {green}$${this.state.player.cash}{white}, Health: {yellow}${this.state.player.health}%`)
      const choice = (await this.comm.question("{revson}D{revsoff}rink, {revson}C{revsoff}urse, {revson}G{revsoff}amble, {revson}L{revsoff}eave: {yellow}")).toUpperCase()

      if (choice === 'D') {
        if (this.state.player.cash < 2) {
          this.comm.writeLine("{red}You can't afford a drink.")
          continue
        }
        this.state.player.cash -= 2
        this.state.player.health = Math.min(100, this.state.player.health + 2)
        this.comm.writeLine("{orange}You have a beer. You feel better.")

      } else if (choice === 'C') {
        const j1 = cursingStart[Math.floor(Math.random() * cursingStart.length)]
        const j2 = cursingStart[Math.floor(Math.random() * cursingStart.length)]
        const j3 = cursingEnd[Math.floor(Math.random() * cursingEnd.length)]
        const j4 = cursingStart[Math.floor(Math.random() * cursingStart.length)]
        const j5 = cursingEnd[Math.floor(Math.random() * cursingEnd.length)]

        this.comm.writeLine(`{red}You yell '${j1} ${j2} ${j3} ${j4}, ${j5}!'`)

        const outcome = Math.floor(Math.random() * 100)
        if (outcome < 80) {
          this.comm.writeLine("{orange}No one is impressed.")
        } else if (outcome < 97) {
          this.comm.writeLine("{orange}Someone throws a bottle at you.")
          this.state.player.health -= 5
          if (this.state.player.health <= 0) {
            this.comm.writeLine("{red}You died!")
            return
          }
        } else {
          this.comm.writeLine("{orange}Everyone laughs. Someone hands you $100!")
          this.state.player.cash += 100
        }

      } else if (choice === 'G') {
        const bet = parseInt(await this.comm.question("Gamble{newline}{newline}{white}Bet Amount? {yellow}"))
        if (isNaN(bet) || bet <= 0 || bet > this.state.player.cash) {
          this.comm.writeLine("{red}Invalid or insufficient bet.")
          continue
        }

        const pick = parseInt(await this.comm.question("{white}Bet on (3-12, not 7 or 11): {yellow}"))
        if ([7, 11].includes(pick) || pick < 3 || pick > 12) {
          this.comm.writeLine("{red}Invalid pick.")
          continue
        }

        const die1 = Math.floor(Math.random() * 6) + 1
        const die2 = Math.floor(Math.random() * 6) + 1
        const total = die1 + die2

        this.comm.writeLine(`{white}You roll the dice... ${die1} and ${die2}`)

        if ([7, 11].includes(total)) {
          this.comm.writeLine(`{red}You lost. The house wins on ${total}.`)
          this.state.player.cash -= bet
        } else if (total === pick) {
          const winnings = bet * (Math.floor(Math.random() * 10) + 1)
          this.comm.writeLine(`{orange}You won $${winnings}!`)
          this.state.player.cash += winnings
        } else {
          this.comm.writeLine("{red}You lost.")
          this.state.player.cash -= bet
        }

      } else if (choice === 'L') {
        this.comm.writeLine("{orange}You stumble out of the bar.")
        return
      } else {
        this.comm.writeLine("{red}Invalid Option")
      }
    }
  }
  async visitLoanShark(): Promise<void> {

    while (true) {
      this.comm.crlf();
      this.comm.writeLine("{white}You enter the loan shark's office.{newline}It smells of sweat and garlic.");
      this.comm.crlf();
      this.comm.writeLine(`{white}You owe {green}$${this.state.player.debt}{white}.`);
      this.comm.writeLine(`You have {green}$${this.state.player.cash}{white}.`);
      this.comm.writeLine("Pay {revson}S{revsoff}ome, Pay {revson}A{revsoff}ll, {revson}L{revsoff}eave: {yellow}");
  
      const choice = (await this.comm.getChar(false, true)).toUpperCase();
  
      if (choice === 'S') {
        this.comm.writeLine("Some.{newline}{white}How much? {yellow}");
        const amountStr = await this.comm.question('');
        const amount = parseInt(amountStr);
  
        if (!amount) continue;
  
        if (amount > this.state.player.debt) {
          this.comm.writeLine("{red}You don't owe that much.");
          continue;
        }
  
        this.state.player.debt -= amount;
        if (this.state.player.debt === 0) return;
        continue;
      }
  
      if (choice === 'A') {
        this.comm.writeLine("All.");
        if (this.state.player.debt > this.state.player.cash) {
          this.comm.writeLine("{red}You don't have that much.");
          continue;
        }
        this.state.player.cash -= this.state.player.debt;
        this.state.player.debt = 0;
        this.comm.crlf();
        this.comm.writeLine("{orange}The Loan Shark thanks you for{newline}your business.");
        this.comm.crlf();
        return;
      }
  
      if (choice === 'L') {
        this.comm.writeLine("Leave");
        return;
      }
    }
  }
  
}
