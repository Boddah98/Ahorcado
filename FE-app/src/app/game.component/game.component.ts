import { Component, OnInit } from '@angular/core';
import{ ConnectionService } from '../services/connection';
import { firstValueFrom } from 'rxjs';
import { word } from '../models/word';
import { result } from '../models/result'
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
  input1=''
  input2=''
  // Data for player1
  player1 =''
  efTimePlayer1 = 0
  roundsPlayer1 = 0
  // Data for player1
  player2 =''
  efTimePlayer2 = 0
  roundsPlayer2 = 0
  // Data for actual game
  actualPlayer = ''
  actualPlayerTime = 0
  win = false
  words : word[]
  actualWord = ''
  round = 1
  wordIndex = 0
  hangedStatus = 0
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
      const startTime = new Date().getTime();

      // Código a ejecutar

      const endTime = new Date().getTime();
      const elapsedTime = endTime - startTime;
      
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
    this.randPlayerInfo();    
    this.togglePopup();
    this.createKeyboard();     
    this.setHangedStatus();    
    this.setWordLetters()
    this.actualPlayerTime = new Date().getTime()
  }
  /*
  * charges the letters container with hidden letter cards for the game using 
  * the connection service gets 4 random words from the backend before
  */
  async setWordLetters(){
    this.actualWord = (this.words[this.wordIndex]).word;
    console.log(this.actualWord)
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
  * set the image of the status of the hanged man 
  */
  setHangedStatus(){
    const hangedField = document.getElementById("hangedField")      
    let imgGame = document.createElement("img");
    imgGame.setAttribute("id", "hangedImg" )
    imgGame.setAttribute("src","../../assets/ah0.png");
    hangedField?.appendChild(imgGame);
  }
  /*
  * actualizes the image instead of the status of the hanged man 
  */
  getHangedStatus():boolean{
    if (this.hangedStatus  > 6){      
      return true
    }
    let imgGame = document.getElementById("hangedImg") as HTMLElement
    
    imgGame.setAttribute("src","../../assets/ah"+this.hangedStatus+".png")
    if (this.hangedStatus == 6){      
      return false
    }
    return true 
  }
  /*
  * inspect if all the hidden letters were discovered and return the status
  */
  checkActualWord():boolean{
    for(let i = 0; i < (this.actualWord).length; i++){
      let gameLetter = document.getElementById("gl-"+i+this.actualWord[i])      
      if (gameLetter?.innerHTML==="_"){ 
        return false        
      }
    }
    this.win = true
    return true
  }
  
  /*
  * Chooses the first turn with the input names of the popup
  */
  randPlayerInfo(){
    let num = Math.floor(Math.random()*2);
    if (num==1){
      this.player1 = this.input1;
      this.player2 = this.input2;
    }else{
      this.player1 = this.input2;
      this.player2 = this.input1;
    }
    this.actualPlayer = this.player1
  }
  createKeyboard(){
    let keyboardContainer = document.getElementById("keyboard")
    this.letters.forEach(letter => {
      //Buttons atributes of the keyboard and event function
      let key = document.createElement("mat-button");
      key.innerHTML = letter;
      key.setAttribute("id","key-"+letter);
        
      const event = key.addEventListener("click",evt=>{      
        let idKey = (evt.target as HTMLElement).id
        const key = document.getElementById(idKey) as HTMLElement   
        //for not to repeat used keys  
        if(key.style.backgroundColor!=='grey'){
          this.pressKeyButton(evt);
        }        
        
      });
      keyboardContainer?.appendChild(key);
    });
  }
  /*
  * handle by the event of the keys buttons, confirms if one play makes win or loose
  */
  pressKeyButton(evt:Event){
    let idKey = (evt.target as HTMLElement).id
    const key = document.getElementById(idKey) as HTMLElement    
    key?.setAttribute("style","background-color : grey")

    let keyLetter = idKey[idKey.length-1]    
    let found = false
    for(let i = 0; i < (this.actualWord).length; i++){
      //Normalize method that replaces vowels with accent for the actual letter 
      let wordGameLetter = this.actualWord[i]
      if (wordGameLetter!=="Ñ"){
        wordGameLetter = (this.actualWord[i]).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }        
      if(keyLetter===wordGameLetter){ //If the keyPressed and some actual word letter is the same, this control catches it        
        const hiddenLetter = document.getElementById("gl-"+i+this.actualWord[i]) as HTMLElement;        
        hiddenLetter.innerHTML = this.actualWord[i]        
        found = true
        //if this condition is true instead of press the button is win
        if(this.checkActualWord()){
          this.endtourn()
        }
      }

    }
    if (!found){
      this.hangedStatus++
      //if this condition is true instead of press the button is loose
      if(!this.getHangedStatus()){
        console.log("game over")
        this.endtourn()
      }
    }
  }
  resetGameField(){
    let keyboard = document.getElementById("keyboard")
    while(keyboard?.firstChild){
      keyboard.removeChild(keyboard.firstChild)
    }
    let lettersContainer = document.getElementById("lettersContainer")
    while(lettersContainer?.firstChild){
      lettersContainer.removeChild(lettersContainer.firstChild)
    }
  }
  endtourn(){
    this.actualPlayerTime = ((new Date().getTime()) - this.actualPlayerTime)
    this.showTournInfo()
    
  }
  resetPlayerInfo(){    
    if(this.actualPlayer === this.player1){
      if (this.win){
        this.roundsPlayer1++
      }
      this.efTimePlayer1 += this.actualPlayerTime
      let timeA = this.printTime(this.efTimePlayer1)
      console.log(timeA)
      this.actualPlayer = this.player2
    }else{
      if (this.win){
        this.roundsPlayer2++
      }
      this.efTimePlayer2 += this.actualPlayerTime
      let timeA = this.printTime(this.efTimePlayer2)
      console.log(timeA)
      this.actualPlayer = this.player1
    }
    this.actualPlayerTime = new Date().getTime()    
  }

  showTournInfo(){
    //Container elements for the pop up
    const mainElement = document.getElementById("main") as HTMLElement
    const endTournDiv = document.createElement("div")
    endTournDiv.setAttribute("class","popup-container")
    
    //Info for the container
    const matCardInfo = document.createElement("mat-card")
    
    const winLabel = document.createElement("h2")
    let labelString = ""
    if(this.win){
      labelString = "¡¡Lo salvaste!!"
    }else{
      labelString ="¡Ay! murió :C"
    }
    winLabel.innerHTML = labelString
    // Info of the recent tourn
    const matCardPlayerInfo = document.createElement("div")
    matCardPlayerInfo.style.backgroundColor = 'white'
    matCardPlayerInfo.style.borderRadius= '5px'
    const wordLabel = document.createElement("h1")
    let wordString = "La palabra era: "+this.actualWord
    wordLabel.innerHTML = wordString

    const playerLabel = document.createElement("h2")
    let playerString = "Jugador: "+this.actualPlayer
    playerLabel.innerHTML = playerString

    const timeLabel = document.createElement("h2")
    let timeString = "Tiempo que te tomó: "+this.printTime(this.actualPlayerTime)+" mins"
    timeLabel.innerHTML = timeString

    const buttonNewStarGame = document.createElement("button")
    buttonNewStarGame.innerHTML = "Continuar"
    buttonNewStarGame.addEventListener("click",evt=>{
      mainElement.removeChild(endTournDiv)
      this.newStartGame()
    })
    matCardInfo.appendChild(winLabel)
    matCardPlayerInfo.appendChild(wordLabel)
    matCardPlayerInfo.appendChild(playerLabel)
    matCardPlayerInfo.appendChild(timeLabel)
    matCardInfo.appendChild(matCardPlayerInfo)
    matCardInfo.appendChild(buttonNewStarGame)
    endTournDiv.appendChild(matCardInfo)
    mainElement.appendChild(endTournDiv)
    
  }
  
  newStartGame(){    
    this.wordIndex++;
    this.resetPlayerInfo()
    this.win = false
    if(this.wordIndex < 4){
      //all the conditions for continue with the tourns 
      this.resetGameField()
      this.createKeyboard()
      this.hangedStatus = 0
      this.getHangedStatus()
      this.setWordLetters()
      if (this.wordIndex == 2){
        this.round++
      }
      
    }else{
      //all the conditions for the end of the rounds and finish the game 
      let gameResult : result 
      
      let gameWinner = ""
      let gameWinMode = ""         
      
      if(this.roundsPlayer1 > this.roundsPlayer2){
        gameWinner = this.player1
        gameWinMode = "Mayoría de rondas"
      }else if(this.roundsPlayer1 < this.roundsPlayer2){
        gameWinner = this.player2
        gameWinMode = "Mayoría de rondas"
      }else if(this.efTimePlayer1 > this.efTimePlayer2){
        gameWinner = this.player2
        gameWinMode = "Menor tiempo efectivo"
      }else if(this.efTimePlayer1 < this.efTimePlayer2){
        gameWinner = this.player1
        gameWinMode = "Menor tiempo efectivo"
      }else{
        gameWinner = "Ninguno"
        gameWinMode = "Empate"
      }

      // Data for player1
      //console.log(this.player1)      
      //console.log(this.roundsPlayer1)
      let timePl1 = this.printTime(this.efTimePlayer1)
      
      //console.log(timePl1)
      // Data for player1
      //console.log(this.player2)
      //console.log(this.roundsPlayer2)
      let timePl2 = this.printTime(this.efTimePlayer2)
      
      //console.log(timePl2)
      //Using the result model for save into the backend 
      gameResult = {
        player1 : this.player1,
        roundsPlayer1 : (this.roundsPlayer1).toString(),
        timePlayer1 : timePl1,
        player2 : this.player2,
        roundsPlayer2 : (this.roundsPlayer2).toString(),
        timePlayer2 : timePl2,    
        winner : gameWinner,
        winMode : gameWinMode
      }
      console.log(gameResult)
    }
  }

  printTime(time:number):string{
    const minutes = Math.floor(time/60000)
    const segs = Math.floor((time%60000)/1000) 
    return minutes+":"+segs 
  }
}
