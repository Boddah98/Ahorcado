import { Component, OnInit } from '@angular/core';
import { result } from '../models/result'
import { ConnectionService } from '../services/connection';import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['../../styles.css']
})
export class resultsComponent implements OnInit {
  title = 'FE-app';
  results : result[] = [] 
  cs : ConnectionService
  constructor(cs:ConnectionService){
    this.cs = cs
    this.chargeResults()
  }
  
  ngOnInit():void{
    this.init()
  }
  async init(){
    this.chargeResults()
  }
  async chargeResults(){
    this.results = (await firstValueFrom(this.cs.getResults())).data as result[]
    const resultsFied = document.getElementById("resultsField") as HTMLElement
   // resultsFied.style.alignItems = 'center'
    this.results.forEach(result => {
      let cardInfo = document.createElement("mat-card")
      cardInfo.style.padding = '10px'
      cardInfo.style.borderRadius = '5px'
      cardInfo.style.backgroundColor = 'silver'

      let l_gi = document.createElement("h2")
      l_gi.innerHTML = "Ganador: " + result.winner
      cardInfo.appendChild(l_gi)
      let l_wm = document.createElement("h2")
      l_wm.innerHTML = "Modo de gane: " + result.winMode
      cardInfo.appendChild(l_wm)
      let l_p1 = document.createElement("h2")
      l_p1.innerHTML = "Player 1: " + result.player1
      cardInfo.appendChild(l_p1)
      let l_r1 = document.createElement("h2")
      l_r1.innerHTML = "Rondas: " + result.roundsPlayer1
      cardInfo.appendChild(l_r1)
      let l_t1 = document.createElement("h2")
      l_t1.innerHTML = "Tiempo efectivo: " + result.timePlayer1
      cardInfo.appendChild(l_t1)
      let l_p2 = document.createElement("h2")
      l_p2.innerHTML = "Player 2: " + result.player2
      cardInfo.appendChild(l_p2)
      let l_r2 = document.createElement("h2")
      l_r2.innerHTML = "Rondas: " + result.roundsPlayer2
      cardInfo.appendChild(l_r2)
      let l_t2 = document.createElement("h2")
      l_t2.innerHTML = "Tiempo efectivo: " + result.timePlayer2
      cardInfo.appendChild(l_t2)
      resultsFied.appendChild(cardInfo)
    });
    console.log("algo")
  }
}
