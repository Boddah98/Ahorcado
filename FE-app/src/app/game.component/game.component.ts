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
  displayPopup = true;
  input1='';
  input2='';
  player1 ='';
  player2 ='';
  words : word[];
  actualWord = '';
  round = 1;
  wordIndex=0;
  hangedStatus=0;
  constructor(cs: ConnectionService){
    this.cs = cs;
    this.words= [];
    

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
  /*
  * Create all the enviroment for start a game 
  */
  async newGame(){
    // gets the words from the backend
    this.words = (await firstValueFrom(this.cs.getWords())).data as word[];
    this.actualWord = (this.words[0]).word;
    console.log(this.actualWord)
    this.randPlayerSelect();
    this.togglePopup();
    this.createKeyboard();     
    this.setHangedStatus();    
    this.setWordLetters()
  }
  /*
  * charges the letters container with hidden letter cards for the game using 
  * the connection service gets 4 random words from the backend before
  */
  async setWordLetters(){
    const lettersContainer = document.querySelector("#lettersContainer") as HTMLElement | null;  
    const wordObj: word | undefined = this.words[this.wordIndex];
    let word = wordObj.word;
    for(let i=0;i<word.length;i++){
      let letter = word[i];
      let gameLetter = document.createElement("mat-card")
      let labelLetter = document.createElement("strong")
      labelLetter.setAttribute("id","gl-"+i+letter);
      labelLetter.innerHTML = "_";
      gameLetter.appendChild(labelLetter);
      lettersContainer?.appendChild(gameLetter)
    }        
  }
  
  /*
  * actualizes the image instead of the status of the hanged man 
  */
  setHangedStatus(){
    const hangedField = document.getElementById("hangedField")      
    let imgGame = document.createElement("img");
    imgGame.setAttribute("id", "hangedImg" )
    imgGame.setAttribute("src","../../assets/ah0.png");
    hangedField?.appendChild(imgGame);
  }
  updateHangedStatus(){
    if (this.hangedStatus  > 6){
      console.log("game is over dude")
      return 
    }
    let imgGame = document.getElementById("hangedImg") as HTMLElement
    console.log("../../assets/ah"+this.hangedStatus+".png")
    imgGame.setAttribute("src","../../assets/ah"+this.hangedStatus+".png")
    if (this.hangedStatus == 6){
      console.log("game over")
    }
  }
  /*
  * Chooses the first turn with the input names of the popup
  */
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
      //Buttons atributes of the keyboard and event function
      let key = document.createElement("mat-button");
      key.innerHTML = letter;
      key.setAttribute("id","key-"+letter);
      key.addEventListener("click",evt=>{
        let idKey = (evt.target as HTMLElement).id;        
        this.pressKeyButton(idKey);
      });
      keyboardContainer?.appendChild(key);
    });
  }

  pressKeyButton(idKey:string){
    let keyLetter = idKey[idKey.length-1]
    let found = false
    for(let i = 0; i < (this.actualWord).length; i++){
      //Normalize method that replaces vowels with accent for the actual letter 
      let wordGameLetter = (this.actualWord[i]).normalize("NFD").replace(/[\u0300-\u036f]/g, "");      
      if(keyLetter===wordGameLetter){ //If the keyPressed and some actual word letter is the same, this control catches it        
        const hiddenLetter = document.getElementById("gl-"+i+this.actualWord[i]) as HTMLElement;
        hiddenLetter.innerHTML = this.actualWord[i]
        found = true
      }
    }
    console.log(keyLetter);
    if (!found){
      this.hangedStatus++
      this.updateHangedStatus()
    }
  }
  
}
