// src/travel.ts
import { Game } from './game'
import { Comm } from './utils/comm'
import { GameState } from './gameState'
import { Combat } from './combat';

import {
  locationNames,
  drugNames,
  drugMinPrices,
  drugMaxPrices,
  drugCanBeCheap,
  drugCanBeExpensive,
  drugRarity,
  cheapDrugMessages,
  expensiveDrugMessages,
  subwayLadyLines,
  stoppedToLines,
  locationBitchOfferChance,
  musicTracks,
  locationPoliceChance,
} from './data'
import { Locations } from './locations'

export class Travel {
  private readonly comm: Comm
  private readonly state: GameState
  private readonly locations: Locations
  private readonly combat: Combat

  constructor(comm: Comm, state: GameState) {
    this.comm = comm
    this.state = state
    this.locations = new Locations(comm, state)
    this.combat = new Combat(comm, state)
  }

  async travelToLocation(): Promise<void> {
    this.comm.writeLine(
      `{white}Travelling to: {red}${
        locationNames[this.state.player.currentLocation]
      }`
    )

    this.PriceDrugs()
    this.ApplyInterest()
    await this.HandleExpensiveDrugs()
    await this.HandleCheapDrugs()
    await this.HandleSubwayLady()
    await this.HandleStoppedTo()
    await this.HandleLoanShark()
    await this.HandleLoanSharkEvent()
    await this.HandleHireOpportunity()
    await this.HandleSubwayFind()
    await this.HandleParaquat()
    await this.HandleCombat()
    await this.HandlePubEvent()
    await this.HandleGunStoreEvent()
    await this.HandleBankEvent()
    await this.HandleHospitalEvent()
    await this.HandleMusicPlaying()

    this.state.player.day++
  }

  PriceDrugs(): void {
    let priceNum = 1
    for (let i = 0; i < drugNames.length; i++) {
      const roll = Math.random() * 100
      this.state.hasDrug[i] = 0
      if (roll < drugRarity[i]) {
        this.state.hasDrug[i] = 1
        this.state.drugPrices[i] = Math.floor(
          drugMinPrices[i] +
            (drugMaxPrices[i] - drugMinPrices[i]) * Math.random()
        )
        this.state.priceNumber[i] = priceNum++
      } else {
        this.state.priceNumber[i] = 99
      }
    }
  }

  ApplyInterest(): void {
    if (this.state.player.debt > 0) {
      this.state.player.debt = Math.floor(this.state.player.debt * 1.05)
    }
  }

  async HandleExpensiveDrugs(): Promise<void> {
    let expensiveCount = 0
    this.comm.write('{newline}')
    for (let i = 0; i < drugNames.length; i++) {
      if (
        this.state.hasDrug[i] &&
        drugCanBeExpensive[i] &&
        expensiveCount <= 3 &&
        Math.random() * 100 < 50
      ) {
        this.state.drugPrices[i] *= 4
        expensiveCount++
        this.comm.writeLine(
          expensiveDrugMessages.e1 + drugNames[i] + expensiveDrugMessages.e2
        )
      }
    }
  }

  async HandleCheapDrugs(): Promise<void> {
    let cheapCount = 0
    this.comm.crlf()
    this.comm.crlf()
    for (let i = 0; i < drugNames.length; i++) {
      if (
        this.state.hasDrug[i] &&
        drugCanBeCheap[i] &&
        cheapCount <= 3 &&
        Math.random() * 100 < 50
      ) {
        this.state.drugPrices[i] = Math.floor(this.state.drugPrices[i] / 4)
        cheapCount++
        this.comm.crlf()
        this.comm.writeLine(cheapDrugMessages[i])
        this.comm.crlf()
      }
    }
  }

  async HandleSubwayLady(): Promise<void> {
    if (Math.random() * 100 > 70) return
    this.comm.crlf()
    this.comm.crlf()
    const line =
      subwayLadyLines[Math.floor(Math.random() * subwayLadyLines.length)]
    this.comm.crlf()
    this.comm.writeLine('{yellow}A lady on the subway says...{orange}')
    this.comm.writeLine(line)
    this.comm.crlf()
  }

  async HandleStoppedTo(): Promise<void> {
    if (Math.random() * 100 > 20) return
    this.comm.crlf()
    this.comm.crlf()
    const action =
      stoppedToLines[Math.floor(Math.random() * stoppedToLines.length)]
    this.comm.crlf()
    this.comm.writeLine(`{purple}You stopped to ${action}`)
    this.comm.crlf()
  }

  async HandleLoanShark(): Promise<void> {
    const debt = this.state.player.debt
    const health = this.state.player.health

    if (debt < 10000) return

    this.comm.crlf()
    this.comm.crlf()

    if (debt > 15000 && debt <= 30000) {
      this.comm.writeLine(
        '{red}The Loan Shark sent some guys around to kick your ass.'
      )
      const damage = Math.floor(Math.random() * 10)
      this.state.player.health -= damage
      if (this.state.player.health <= 0) {
        this.comm.writeLine('{red}You died from the beating!')
      }
    } else {
      this.comm.writeLine(
        "{red}The Loan Shark says you'd better pay up soon - or else!"
      )
    }

    this.comm.crlf()
    this.comm.crlf()
  }

  async HandleLoanSharkEvent(): Promise<void> {
    if (this.state.player.currentLocation !== 0) return
    const answer = await this.comm.question(
      '{white}Visit the Loan Shark? (Y/N): {yellow}'
    )
    if (answer.trim().toUpperCase() === 'Y') {
      this.comm.writeLine('{white}You visit the Loan Shark...')
      await this.locations.visitLoanShark()
    }
  }

  async HandleHireOpportunity(): Promise<void> {
    const chance = Math.floor(Math.random() * 100)
    const loc = this.state.player.currentLocation
    if (chance > locationBitchOfferChance[loc]) return
    this.comm.writeLine('{white}You see a shady figure offering work...')
  }

  async HandleSubwayFind(): Promise<void> {
    if (this.state.player.carryLeft <= 0 || Math.random() * 100 > 5) return

    const i = Math.floor(Math.random() * (drugNames.length - 1))
    let j = Math.floor(Math.random() * 10) + 2
    if (j > this.state.player.carryLeft) j = this.state.player.carryLeft

    this.comm.writeLine(
      `{purple}You found ${j} units of ${drugNames[i]} on the subway!`
    )

    if (this.state.player.drugCounts[i] === 0)
      this.state.player.drugAveragePrices[i] = 0
    this.state.player.drugAveragePrices[i] = Math.floor(
      (this.state.player.drugCounts[i] *
        this.state.player.drugAveragePrices[i]) /
        (this.state.player.drugCounts[i] + j)
    )
    this.state.player.drugCounts[i] += j
  }

  async HandleParaquat(): Promise<void> {
    if (Math.random() * 100 > 5) return
    this.comm.writeLine(
      '{ltgrn}There is some weed here that smells like paraquat.'
    )
    const answer = await this.comm.question('{white}Smoke it? (Y/N): ')
    if (answer.trim().toUpperCase() !== 'Y') {
      this.comm.writeLine('{white}Probably the wisest move.')
      return
    }

    if (Math.random() * 100 < 30) {
      this.comm.writeLine('{red}It made you sick as hell.')
      this.state.player.health -= 10
      if (this.state.player.health <= 0) {
        this.comm.writeLine('{red}You died from the paraquat!')
      }
    } else {
      this.comm.writeLine('{orange}It was great!')
      let j = Math.floor(Math.random() * this.state.player.carryLeft)
      if (j <= 0) return

      this.comm.writeLine(`The dealer comps you ${j} units of weed.`)
      const i = 11 // index for weed
      if (this.state.player.drugCounts[i] === 0)
        this.state.player.drugAveragePrices[i] = 0
      this.state.player.drugAveragePrices[i] = Math.floor(
        (this.state.player.drugCounts[i] *
          this.state.player.drugAveragePrices[i]) /
          (this.state.player.drugCounts[i] + j)
      )
      this.state.player.drugCounts[i] += j
    }
  }
  async HandleCombat(): Promise<void> {
    const { currentLocation } = this.state.player;

    const chance = locationPoliceChance[currentLocation];
    if (Math.random() * 100 > chance) return;
  
    // Trigger combat logic here
    await this.combat.fightCops();
  
  }
  async HandlePubEvent(): Promise<void> {
    if (this.state.player.currentLocation !== 1) return
    const answer = await this.comm.question(
      '{white}Stop at the bar? (Y/N): {yellow}'
    )
    if (answer.trim().toUpperCase() === 'Y') {
      await this.locations.visitBar()
    }
  }

  async HandleGunStoreEvent(): Promise<void> {
    if (this.state.player.currentLocation !== 5) return
    const answer = await this.comm.question(
      '{white}Visit the gun store? (Y/N): {yellow}'
    )
    if (answer.trim().toUpperCase() === 'Y') {
      await this.locations.visitGunStore()
    }
  }

  async HandleBankEvent(): Promise<void> {
    if (this.state.player.currentLocation !== 3) return
    const answer = await this.comm.question(
      '{white}Visit the bank? (Y/N): {yellow}'
    )
    if (answer.trim().toUpperCase() === 'Y') {
      await this.locations.visitBank()
    }
  }

  async HandleHospitalEvent(): Promise<void> {
    if (this.state.player.currentLocation !== 7) return
    const answer = await this.comm.question(
      '{white}Visit the hospital? (Y/N): {yellow}'
    )
    if (answer.trim().toUpperCase() === 'Y') {
      await this.locations.visitHospital()
    }
  }

  async HandleMusicPlaying(): Promise<void> {
    if (Math.random() * 100 > 15) return
    const track =
      musicTracks[Math.floor(Math.random() * musicTracks.length)]
    this.comm.writeLine('{cyan}You hear music playing...{newline}{yellow}It\'s')
    this.comm.writeLine(track)
  }
}