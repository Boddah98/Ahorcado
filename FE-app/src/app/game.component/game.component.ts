import { Component, OnInit } from '@angular/core';
import{ ConnectionService } from '../services/connection';
import { firstValueFrom } from 'rxjs';
import { word } from '../models/word';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['../../styles.css']
})
export class gameComponent implements OnInit{
  title = 'FE-app';
  letters = 
    ["Q","W","E","R","T","Y","U","I","O","P",
    "A","S","D","F","G","H","J","K","L","Ñ",
    "Z","X","C","V","B","N","M"    
  ];
  cs : ConnectionService;
  displayPopup = false;
  input1='';
  input2='';
  player1 ='';
  player2 ='';
  words : word[];
  constructor(cs: ConnectionService){
    this.cs = cs;
    this.words= [];
    document.addEventListener('DOMContentLoaded', () => {
      this.createKeyboard();
      this.togglePopup();
      this.newGame();
    });

  }
  ngOnInit(): void {
    
    this.init();
  }
  async init(){
    document.getElementById("starGameButton")?.addEventListener("click",evt=>{
      this.newGame();
    })
    
  }
  togglePopup() {
    const popupElement = document.querySelector("#popup") as HTMLElement | null;  
    if (popupElement) {
      if (!this.displayPopup) {
        this.displayPopup = true;
        popupElement.style.display = 'fixed'; 
      } else {
        this.displayPopup = false;
        popupElement.style.display = 'none';
      }      
    }
    
  }
  newGame(){
    this.randPlayerSelect();
    this.togglePopup();
    this.setHangedStatus();
    this.getWordSet();
  }
  setHangedStatus(){
    const hangedField = document.getElementById("hangedField")      
    let imgGame = document.createElement("img");
    imgGame.setAttribute("src","../../assets/ah6.png");
    hangedField?.appendChild(imgGame);
  }
  async getWordSet(){
    this.words = (await firstValueFrom(this.cs.getWords())).data as word[];
    console.log(this.words)
  }
  randPlayerSelect(){
    let num = Math.floor(Math.random()*2);
    if (num==1){
      this.player1 = this.input1;
      this.player2 = this.input2;
    }else{
      this.player1 = this.input2;
      this.player2 = this.input1;
    }
    
  }
  createKeyboard(){
    let keyboardContainer = document.getElementById("keyboard")
    this.letters.forEach(letter => {
      let letterObj = document.createElement("mat-button");
      letterObj.innerHTML = letter;
      letterObj.setAttribute("id",letter);
      keyboardContainer?.appendChild(letterObj);
    });
  }
}
