import { Component, OnInit } from '@angular/core';
import { gameComponent } from './game.component/game.component';
import { MatDrawerMode } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css']
})
export class AppComponent implements OnInit {
  title = 'FE-app';
  sidenavMode : MatDrawerMode = 'side';
  initiateGame = true;
  showResults = false;
  constructor(){
    
  }
  ngOnInit(): void {
      this.init()
  }
  async init(){
    const gameSelector = document.getElementById("game") as HTMLElement
    gameSelector.addEventListener("click",evt=>{
      this.initiateGame = true
      this.showResults = false
    })
    const resultSelector = document.getElementById("results") as HTMLElement
    resultSelector.addEventListener("click",evt=>{
      this.showResults = true
      this.initiateGame = false
    })
  }
}
